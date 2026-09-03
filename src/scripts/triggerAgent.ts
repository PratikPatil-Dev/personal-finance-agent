import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { connectDb } from "../config/database.js";
import { runAgent } from "../agent/index.js";

const main = async () => {
    await connectDb();
    try {
        // Matches the test user seeded by addTestData.ts
        const response = await runAgent("69a9c1bcc6d78f6d45ff8733", "Hello");
        console.log(response);
    } finally {
        await mongoose.disconnect();
    }
}

main();