import { Telegraf } from "telegraf";
import { config } from "../config/env.js";

const NGROK_URL = "https://6bd7-45-112-12-11.ngrok-free.app";
const BASE_URL = config.baseUrl || NGROK_URL;

const bot = new Telegraf(config.telegramBotToken!);

const setTGWebhook = async () => {
    try {
        if (!config.telegramWebhookSecret) {
            throw new Error("TELEGRAM_WEBHOOK_SECRET is not set in .env");
        }
        const url = `${BASE_URL}/webhook/telegram`;
        await bot.telegram.setWebhook(url, { secret_token: config.telegramWebhookSecret });
        console.log("Telegram webhook set successfully to:", url);
    } catch (error) {
        console.error("Error setting Telegram webhook", error);
    }
}

setTGWebhook();