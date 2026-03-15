import dotenv from "dotenv";
dotenv.config();
import { Telegraf, Context } from "telegraf";
import { Request as req, Response as res } from "express";
import { findOrCreateUser } from "../services/user.service.js";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

bot.start(async (ctx) => {
    console.log(ctx.message)
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

bot.on('text', async (ctx: Context) => {
    try {
        // 1. get user from DB, validate exists

        // 2. fetch last 15 messages from Conversations collection

        // 3. fetch active memories from UserMemory collection (local)

        // 4. fetch relevant semantic memories from Supermemory

        // 5. build system prompt injecting memories as context

        // 6. call OpenAI with conversation history + tools defined

        // 7. handle tool calls if any (logTransaction, queryTransactions etc)

        // 8. save user message + assistant response to Conversations

        // 9. send final response to user on Telegram
    } catch (error) {
        await ctx.reply("Something went wrong. Please try again.");
    }
});
export const botMiddleware = bot
export const handleWebhook = async (req: req, res: res) => {

    console.log("Received webhook from Telegram");
    await bot.handleUpdate(req.body, res);
}