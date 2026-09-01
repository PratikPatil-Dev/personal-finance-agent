import { z } from "zod";
import type Anthropic from "@anthropic-ai/sdk";

const toInputSchema = (schema: z.ZodType): Anthropic.Tool.InputSchema =>
    z.toJSONSchema(schema) as Anthropic.Tool.InputSchema;

const memoryTypeEnum = z.enum(["goal", "preferences", "relationship", "habits", "other"]);

export const AddMemorySchema = z.object({
    memory: z.string().describe("event, goal, content that needs to be stored as a user's memory"),
    type: memoryTypeEnum.describe("Type of memory being stored"),
    expiryDate: z.string().optional().describe("Date at which this memory should expire, eg. travel fund for september 2026"),
});
export type AddMemoryInput = z.infer<typeof AddMemorySchema>;

const addMemory = {
    name: "add_memory",
    description: "add a important memory like users goals, plans, habbits, preferrances, relationships, etc.",
    input_schema: toInputSchema(AddMemorySchema),
};

export const UpdateMemorySchema = z.object({
    memoryId: z.string().describe("memoryId to update the memory of"),
    memory: z.string().optional().describe("updated event, goal, content that needs to be updated in user's memory"),
    type: memoryTypeEnum.optional().describe("Type of memory being stored"),
    expiryDate: z.string().optional().describe("Date at which this memory should expire, eg. travel fund for september 2026"),
});
export type UpdateMemoryInput = z.infer<typeof UpdateMemorySchema>;

const updateMemory = {
    name: "update_memory",
    description: "Search existing memories before adding a new one. Always call this first when user mentions goals, preferences, or plans to check if a similar memory already exists. Update based on memoryId and userId",
    input_schema: toInputSchema(UpdateMemorySchema),
};

export const GetMemorySchema = z.object({
    query: z.string().describe("Search query to find relevant memories e.g. 'drone goal' or 'salary'"),
});
export type GetMemoryInput = z.infer<typeof GetMemorySchema>;

const getMemory = {
    name: "get_memory",
    description: "get a important memory of user like their goals, plans, habbits, preferrances, relationships, etc. based on userId",
    input_schema: toInputSchema(GetMemorySchema),
};

export const memoryTools = [addMemory, updateMemory, getMemory];
