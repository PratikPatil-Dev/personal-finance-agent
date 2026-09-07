import { buildSystemPrompt } from "./prompts.js";
import { tools } from "../tools/index.js";
import { getRecentConversations, saveMessage } from "../services/conversation.service.js";
import { getMemory } from "../services/memory.service.js";
import type { IUserMemory } from "../models/userMemory.model.js";
import { addPersistentMemory, searchPersistentMemory } from "../services/supermemory.service.js";
import { formatLocalMemories, formatPersistentMemories } from "../utils/formatingFunctions.js";
import { config } from "../config/env.js";
import Anthropic from "@anthropic-ai/sdk";
import { toolExecuter } from "./toolExecutor.js";

const client = new Anthropic({
    apiKey: config.anthropicApiKey,
});

const MODEL = config.model || "claude-haiku-4-5-20251001";
const MAX_TOKENS = 1024;
const MAX_TOOL_ITERATIONS = 8;

const FALLBACK_REPLY = "Sorry, something isn't quite right on my end. Give me a moment and try again?";
const ABORTED_REPLY = "I'm having trouble finishing that request. Could you try rephrasing it, or breaking it into smaller steps?";

export interface ImageInput {
    base64: string;
    mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
}

export const runAgent = async (
    userId: string,
    userMessage: string,
    images?: ImageInput[]
): Promise<string> => {

    const [conversations, localMemories, persistentMemories] = await Promise.all([
        getRecentConversations(userId),
        getMemory(userId, userMessage),
        searchPersistentMemory(userId, userMessage)
    ]);

    const historyNote = images?.length ? `${userMessage} [attached ${images.length} image(s)]` : userMessage;
    await Promise.all([
        saveMessage(userId, "user", historyNote),
        addPersistentMemory(userId, userMessage)
    ]);

    const userContent: Anthropic.MessageParam["content"] = images?.length
        ? [
            ...images.map((image) => ({
                type: "image" as const,
                source: {
                    type: "base64" as const,
                    media_type: image.mediaType,
                    data: image.base64,
                },
            })),
            { type: "text" as const, text: userMessage },
        ]
        : userMessage;

    const systemPrompt = buildSystemPrompt(
        formatLocalMemories(localMemories as IUserMemory[]),
        formatPersistentMemories(persistentMemories)
    );

    // History belongs in `messages`, not the system prompt. Sending it in both
    // places doubled the token cost of every request in the loop.
    const messages: Anthropic.MessageParam[] = [
        ...conversations
            .slice()
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
            .map(c => ({
                role: c.role as "user" | "assistant",
                content: String(c.content),
            })),
        { role: "user", content: userContent },
    ];

    let message = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages,
        tools,
    });

    let toolIterations = 0;
    while (message.stop_reason === "tool_use") {
        toolIterations++;
        if (toolIterations > MAX_TOOL_ITERATIONS) {
            console.error(`Tool loop exceeded ${MAX_TOOL_ITERATIONS} iterations for user ${userId}, aborting.`);
            await saveMessage(userId, "assistant", ABORTED_REPLY);
            return ABORTED_REPLY;
        }

        // Every tool_use block needs a matching tool_result — including failures.
        // Omitting one makes the next request invalid.
        const toolResults: Anthropic.ToolResultBlockParam[] = [];

        for (const block of message.content) {
            if (block.type !== "tool_use") continue;

            let result: unknown;
            try {
                result = await toolExecuter(block.name, block.input, userId);
            } catch (error) {
                // Return the failure to the model so it can correct itself,
                // instead of throwing and losing the whole turn.
                console.error(`Tool ${block.name} failed for user ${userId}:`, error);
                result = { error: error instanceof Error ? error.message : String(error) };
            }

            toolResults.push({
                type: "tool_result",
                tool_use_id: block.id,
                content: JSON.stringify(result),
            });
        }

        // Accumulate rather than rebuild: later rounds need the earlier tool calls
        // and their results, e.g. an id fetched by get_transactions and then updated.
        messages.push({ role: "assistant", content: message.content });
        messages.push({ role: "user", content: toolResults });

        message = await client.messages.create({
            model: MODEL,
            max_tokens: MAX_TOKENS,
            system: systemPrompt,
            messages,
            tools,
        });
    }

    const textBlock = message.content.find(block => block.type === "text");
    const reply = textBlock?.text ?? FALLBACK_REPLY;

    await saveMessage(userId, "assistant", reply);
    return reply;
}
