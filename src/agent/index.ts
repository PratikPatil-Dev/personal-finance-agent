import { buildSystemPrompt } from "./prompts.js";
import { tools } from "../tools/index.js";
import UserMemory from "../models/userMemory.model.js";
import { getRecentConversations, saveMessage } from "../services/conversation.service.js";
import { getMemory } from "../services/memory.service.js";
import type { IConversation } from "../models/conversation.model.js";
import type { IUserMemory } from "../models/userMemory.model.js";
import { searchPersistentMemory } from "../services/supermemory.service.js";
import { formatConversations, formatLocalMemories } from "../utils/formatingFunctions.js";
import { config } from "../config/env.js";
import Anthropic from "@anthropic-ai/sdk";
import { addTransaction, updateTransaction, deleteTransaction, getTransactions } from "../services/transaction.service.js";
import { toolExecuter } from "./toolExecutor.js";

const client = new Anthropic({
    apiKey: config.anthropicApiKey,
});

export const runAgent = async (
    userId: string,
    userMessage: string
): Promise<string> => {

    const [conversations, localMemories, persistentMemories] = await Promise.all([
        getRecentConversations(userId),
        getMemory(userId),
        searchPersistentMemory(userId, userMessage)
    ]);

    await saveMessage(userId, "user", userMessage);

    const formattedMessages = formatConversations(conversations as IConversation[])
    const formattedLocalMemories = formatLocalMemories(localMemories as IUserMemory[])

    const formattedHistory = conversations
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map(c => ({
            role: c.role as "user" | "assistant",
            content: String(c.content)
        }));

    const systemPrompt = buildSystemPrompt(formattedMessages, formattedLocalMemories, '')

    let message = await client.messages.create({
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
            ...formattedHistory,
            {
                role: "user",
                content: userMessage
            }
        ],
        tools: tools,
        model: "claude-sonnet-4-20250514"
    })
    console.log("message", message)
    while (message.stop_reason === "tool_use") {
        const toolBlocks = message.content.filter(block => block.type === "tool_use");
        const toolResults = [];

        for (const block of toolBlocks) {
            const tool = tools.find(t => t.name === block.name);
            if (tool) {
                console.log(block.input, "block.input")
                const result = await toolExecuter(block.name, block.input, userId);
                toolResults.push({
                    type: "tool_result" as const,
                    tool_use_id: block.id,
                    content: JSON.stringify(result)
                });
            }
        }
        message = await client.messages.create({
            max_tokens: 1024,
            system: systemPrompt,
            messages: [
                ...formattedHistory,
                { role: "user", content: userMessage },
                { role: "assistant", content: message.content },
                { role: "user", content: toolResults }
            ],
            tools: tools,
            model: "claude-sonnet-4-20250514",
        });
        
    }
    const textBlock = message.content.find(block => block.type === "text")
    await saveMessage(userId, "assistant", textBlock?.text ?? "Hey sorry, Something is not quite right, can yiu give me some time to fix it?");
    return textBlock?.text ?? "Hey sorry, Something is not quite right, can yiu give me some time to fix it?"

}