import UserMemory from "../models/userMemory.model.js";

const getMemory = async (userId: string, query: string) => {
    return await UserMemory.find({
        userId: userId,
        isActive: true,
        $text: { $search: query },
        $or: [
            { expiresAt: { $gt: new Date() } },
            { expiresAt: null }
        ]
    });
}

const addMemory = async (userId: string, type: "goal" | "budget" | "preferences" | "relationship" | "habits" | "other", content: string, expiresAt?: Date) => {
    try {
        const memory = await UserMemory.create({
            userId,
            type,
            content,
            expiresAt
        });
        return memory;
    } catch (error) {
        console.error("Error adding memory:", error);
        throw new Error("Failed to add memory");
    }
}

// Scoped by userId as well as _id — the model supplies the memoryId, so matching
// on _id alone would let a hallucinated id reach another user's memory.
const updateMemory = async (
    userId: string,
    memoryId: string,
    memory?: string,
    type?: "goal" | "budget" | "preferences" | "relationship" | "habits" | "other",
    expiresAt?: Date
) => {
    try {
        const update: Record<string, unknown> = {};
        if (memory !== undefined) update.content = memory;
        if (type !== undefined) update.type = type;
        if (expiresAt !== undefined) update.expiresAt = expiresAt;

        const memoryUpdated = await UserMemory.findOneAndUpdate(
            { _id: memoryId, userId, isActive: true },
            { $set: update },
            { new: true }
        );
        if (!memoryUpdated) {
            return { error: "No memory found with that id for this user. Call get_memory to find the correct id." };
        }
        return memoryUpdated;
    } catch (error) {
        console.error("Error updating memory:", error);
        throw new Error("Failed to update memory");
    }
};

export {
    getMemory,
    addMemory,
    updateMemory
}