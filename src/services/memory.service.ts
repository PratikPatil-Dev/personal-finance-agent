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

const addMemory = async (userId: string, type: "goal" | "preferences" | "relationship" | "habits" | "other", content: string, expiresAt?: Date) => {
    try {
        const memory = await UserMemory.create({
            userId,
            type,
            content,
            expiresAt
        });
        return memory;
    } catch (error) {
        console.log("Error adding memory:", error);
        throw "Failed to add memory";
    }
}

const updateMemory = async (
    memoryId: string,
    memory?: string,
    type?: "goal" | "preferences" | "relationship" | "habits" | "other",
    expiresAt?: Date
) => {
    try {
        const update: Record<string, unknown> = {};
        if (memory !== undefined) update.content = memory;
        if (type !== undefined) update.type = type;
        if (expiresAt !== undefined) update.expiresAt = expiresAt;

        const memoryUpdated = await UserMemory.findByIdAndUpdate(
            memoryId,
            { $set: update },
            { new: true }
        );
        return memoryUpdated;
    } catch (error) {
        console.log("Error updating memory:", error);
        throw "Failed to update memory";
    }
};

export {
    getMemory,
    addMemory,
    updateMemory
}