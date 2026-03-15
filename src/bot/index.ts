import dotenv from "dotenv";
dotenv.config();
import { Telegraf } from "telegraf";
import { Request as req, Response as res } from "express";
import { findOrCreateUser } from "../services/user.service.js";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

bot.start(async (ctx) => {
    console.log(ctx.message)
    const tgUserId = ctx.message.from.id
    const tgChatId = ctx.chat.id
    const name = `${ctx.message.from.first_name} ${ctx.message.from.last_name ?? ""}`.trim();
    const username = ctx.message.from.username;
    const {isNew, user} = await findOrCreateUser( tgUserId, tgChatId, name, username)
    if (isNew) {

        ctx.reply(`Hello ${user?.name}! I'm your personal finance agent. How can I help you today?`);
    } else {
        ctx.reply(`Welcome back ${user?.name}`)
    }
});

export const botMiddleware = bot
export const handleWebhook = async (req: req, res: res) => {

    console.log("Received webhook from Telegram");
    await bot.handleUpdate(req.body, res);
}