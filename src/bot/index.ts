import dotenv from "dotenv";
dotenv.config();
import crypto from "node:crypto";
import { Telegraf } from "telegraf";
import { Request as req, Response as res } from "express";
import { findOrCreateUser } from "../services/user.service.js";
import { runAgent, type ImageInput } from "../agent/index.js";
import { saveMessage } from "../services/conversation.service.js";
import { config } from "../config/env.js";

const bot = new Telegraf(config.telegramBotToken!);

const isValidWebhookSecret = (headerValue: unknown): boolean => {
    if (!config.telegramWebhookSecret || typeof headerValue !== "string") return false;
    const expected = Buffer.from(config.telegramWebhookSecret);
    const actual = Buffer.from(headerValue);
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
};

const PHOTO_BATCH_WINDOW_MS = 2500;

interface PhotoBuffer {
    tgChatId: number;
    images: ImageInput[];
    captions: string[];
    timer: NodeJS.Timeout;
}

const photoBuffers = new Map<string, PhotoBuffer>();

const downloadTelegramPhoto = async (fileUrl: string): Promise<ImageInput> => {
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const contentType = response.headers.get("content-type");
    const mediaType: ImageInput["mediaType"] =
        contentType === "image/png" || contentType === "image/gif" || contentType === "image/webp"
            ? contentType
            : "image/jpeg";
    return { base64, mediaType };
};

const flushPhotoBuffer = async (userId: string) => {
    const buffer = photoBuffers.get(userId);
    if (!buffer) return;
    photoBuffers.delete(userId);

    const caption = buffer.captions.filter(Boolean).join(" ") || "[receipt image(s), no caption]";
    try {
        const response = await runAgent(userId, caption, buffer.images);
        await bot.telegram.sendMessage(buffer.tgChatId, response);
    } catch (error) {
        console.error("Error processing buffered images:", error);
        await bot.telegram.sendMessage(buffer.tgChatId, "Something went wrong processing those images. Please try again.");
    }
};

bot.start(async (ctx) => {
    const tgUserId = ctx.message.from.id
    const tgChatId = ctx.chat.id
    const name = `${ctx.message.from.first_name} ${ctx.message.from.last_name ?? ""}`.trim();
    const username = ctx.message.from.username;
    const { isNew, user } = await findOrCreateUser(tgUserId, tgChatId, name, username)
    if (isNew) {

        ctx.reply(`Hello ${user?.name}! I'm your personal finance agent. How can I help you today?`);
    } else {
        ctx.reply(`Welcome back ${user?.name}, I'm your personal finance agent. How can I help you today?`)
    }
});

bot.on('text', async (ctx) => {
    try {
        if (!ctx?.message?.from?.id || !ctx?.message?.text || !ctx?.chat?.id) {
            return;
        }
        const tgChatId = ctx.chat.id;
        const name = `${ctx.message.from.first_name} ${ctx.message.from.last_name ?? ""}`.trim();
        const username = ctx.message.from.username;

        const { isNew, user } = await findOrCreateUser(ctx.message.from.id, tgChatId, name, username)

        const tgUserId = user?._id.toString();
        const userMessage = ctx.message.text;

        const response = await runAgent(tgUserId, userMessage);
        ctx.reply(response);
    } catch (error) {
        console.error("Error handling text message:", error);
        await ctx.reply("Something went wrong. Please try again.");
    }
});

bot.on('photo', async (ctx) => {
    try {
        const tgUserId = ctx.message.from?.id;
        const tgChatId = ctx.chat?.id;
        if (!tgUserId || !tgChatId) return;

        const name = `${ctx.message.from.first_name} ${ctx.message.from.last_name ?? ""}`.trim();
        const username = ctx.message.from.username;
        const { user } = await findOrCreateUser(tgUserId, tgChatId, name, username);

        const userId = user?._id.toString();
        if (!userId) return;

        const photoSizes = ctx.message.photo;
        const largest = photoSizes[photoSizes.length - 1];
        const fileLink = await ctx.telegram.getFileLink(largest.file_id);
        const image = await downloadTelegramPhoto(fileLink.href);

        const existing = photoBuffers.get(userId);
        if (existing) {
            clearTimeout(existing.timer);
            existing.images.push(image);
            if (ctx.message.caption) existing.captions.push(ctx.message.caption);
            existing.timer = setTimeout(() => void flushPhotoBuffer(userId), PHOTO_BATCH_WINDOW_MS);
        } else {
            photoBuffers.set(userId, {
                tgChatId,
                images: [image],
                captions: ctx.message.caption ? [ctx.message.caption] : [],
                timer: setTimeout(() => void flushPhotoBuffer(userId), PHOTO_BATCH_WINDOW_MS),
            });
        }
    } catch (error) {
        console.error("Error handling photo message:", error);
        await ctx.reply("Something went wrong processing that image. Please try again.");
    }
});

export const botMiddleware = bot
export const handleWebhook = async (req: req, res: res) => {
    if (!isValidWebhookSecret(req.headers["x-telegram-bot-api-secret-token"])) {
        console.warn("Rejected webhook request with invalid or missing secret token");
        res.sendStatus(401);
        return;
    }

    try {
        await bot.handleUpdate(req.body, res);
    } catch (error) {
        console.error("Error handling Telegram webhook update:", error);
    } finally {
        if (!res.headersSent) {
            res.sendStatus(200);
        }
    }
}