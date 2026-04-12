import dotenv from "dotenv";
dotenv.config();
import express, { type Request, type Response } from "express";
import { connectDb } from "./config/database.js";
import { handleWebhook } from "./bot/index.js";
import Anthropic from "@anthropic-ai/sdk";
import { config } from "./config/env.js";


const app = express();
const PORT = Number(process.env.PORT ?? 8888);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Express + TypeScript server is running" });
});

app.post("/webhook/telegram", handleWebhook);

const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Error starting server", error);
  }
};

startServer();
