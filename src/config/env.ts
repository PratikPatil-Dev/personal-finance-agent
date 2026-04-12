import dotenv from "dotenv";
dotenv.config();

export const config = {
    port: process.env.PORT,
    mongoUri: process.env.MONGODB_URI,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
    supermemoryApiKey: process.env.SUPERMEMORY_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY
}