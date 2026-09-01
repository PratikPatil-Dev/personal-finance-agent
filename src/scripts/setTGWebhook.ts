import { Telegraf } from "telegraf";
import dotenv from "dotenv";
dotenv.config();

const NGROK_URL = "https://bca0-45-112-12-11.ngrok-free.app";
const BASE_URL = process.env.BASE_URL || NGROK_URL;

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

const setTGWebhook = async () => {
    try {
        const url = `${BASE_URL}/webhook/telegram`;
        await bot.telegram.setWebhook(url);
        console.log("Telegram webhook set successfully to:", url);
    } catch (error) {
        console.error("Error setting Telegram webhook", error);
    }
}

setTGWebhook();