import mongoose from "mongoose";
import { config } from "./env.js";

export const connectDb = async () => {
    try {
        await mongoose.connect(config.mongoUri!);
        console.log("Connected to database");
    } catch (error) {
        console.error("Error connecting to database", error);
        process.exit(1);
    }
}