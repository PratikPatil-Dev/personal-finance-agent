import { buildSystemPrompt } from "./prompts.js";
import { tools } from "../tools/index.js";
// import UserMemory from "../models/userMemory.model.js";
import { getRecentConversations, saveMessage } from "../services/conversation.service.js";
import { getMemory } from "../services/memory.service.js";
import type { IConversation } from "../models/conversation.model.js";
import type { IUserMemory } from "../models/userMemory.model.js";
import { addPersistentMemory, searchPersistentMemory } from "../services/supermemory.service.js";
import { formatConversations, formatLocalMemories, formatPersistentMemories } from "../utils/formatingFunctions.js";
import { config } from "../config/env.js";
import Anthropic from "@anthropic-ai/sdk";
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
        getMemory(userId, userMessage),
        searchPersistentMemory(userId, userMessage)
    ]);

    await Promise.all([
        saveMessage(userId, "user", userMessage),
        addPersistentMemory(userId, userMessage)
    ]);

    const formattedMessages = formatConversations(conversations as IConversation[])
    const formattedLocalMemories = formatLocalMemories(localMemories as IUserMemory[])
    const formattedPersistentMemories = formatPersistentMemories(persistentMemories);


    const formattedHistory = conversations
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map(c => ({
            role: c.role as "user" | "assistant",
            content: String(c.content)
        }));

    const systemPrompt = buildSystemPrompt(formattedMessages, formattedLocalMemories, formattedPersistentMemories)

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
        model: config.model || "claude-haiku-4-5-20251001"
    })
    // console.log("message", message)
    const MAX_TOOL_ITERATIONS = 8;
    let toolIterations = 0;
    while (message.stop_reason === "tool_use") {
        toolIterations++;
        if (toolIterations > MAX_TOOL_ITERATIONS) {
            console.log(`Tool-use loop exceeded ${MAX_TOOL_ITERATIONS} iterations for user ${userId}, aborting.`);
            const fallback = "Hey, I'm having trouble finishing that request right now. Could you try rephrasing it or breaking it into smaller steps?";
            await saveMessage(userId, "assistant", fallback);
            return fallback;
        }

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
            model: config.model || "claude-haiku-4-5-20251001",
        });
        
    }
    const textBlock = message.content.find(block => block.type === "text")
    await saveMessage(userId, "assistant", textBlock?.text ?? "Hey sorry, Something is not quite right, can yiu give me some time to fix it?");
    return textBlock?.text ?? "Hey sorry, Something is not quite right, can yiu give me some time to fix it?"

}