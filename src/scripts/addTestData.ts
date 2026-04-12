import dotenv from "dotenv";
dotenv.config();
import { connectDb } from "../config/database.js"
import Conversation from "../models/conversation.model.js"
import UserMemory from "../models/userMemory.model.js"

const dummyConversations = [
    {
        userId: "69a9c1bcc6d78f6d45ff8733",
        content: "Hello",
        role: "user",
        tgChatId: 8598274810
    },
    {
        userId: "69a9c1bcc6d78f6d45ff8733",
        content: "Hey, how can I help you?",
        role: "assistant",
        tgChatId: 8598274810
    },
    {
        userId: "69a9c1bcc6d78f6d45ff8733",
        content: "I want to add a transaction",
        role: "user",
        tgChatId: 8598274810
    },
    {
        userId: "69a9c1bcc6d78f6d45ff8733",
        content: "Sure, what is the transaction?",
        role: "assistant",
        tgChatId: 8598274810
    },
    {
        userId: "69a9c1bcc6d78f6d45ff8733",
        content: "I spent 350rs on coffee",
        role: "user",
        tgChatId: 8598274810
    }
]

const dummyUserMemories = [
    {
        userId: "69a9c1bcc6d78f6d45ff8733",
        type: "goal",
        content: "I want to save 10000rs in 3 months",
        isActive: true,
    },
    {
        userId: "69a9c1bcc6d78f6d45ff8733",
        type: "preferences",
        content: "I prefer to save 10% of my income",
        isActive: true,
    },
    {
        userId: "69a9c1bcc6d78f6d45ff8733",
        type: "habits",
        content: "I spend most of my money on food",
        isActive: true,
    },
    {
        userId: "69a9c1bcc6d78f6d45ff8733",
        type: "relationship",
        content: "I want to save money for my family",
        isActive: true,
    },
    {
        userId: "69a9c1bcc6d78f6d45ff8733",
        type: "other",
        content: "I want to save money for my education",
        isActive: true,
    },
]

const loadData = async () => {
    try {
        await connectDb();
        const [conversations, userMemories] = await Promise.all([
            Conversation.insertMany(dummyConversations),
            UserMemory.insertMany(dummyUserMemories)
        ])
        console.log("Conversations", conversations)
        console.log("User Memories", userMemories)
    } catch (error) {
        console.log(error)
    }
}

loadData()