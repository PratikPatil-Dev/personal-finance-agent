import UserMemory from "../models/userMemory.model.js";

const getMemory = async (userId: string) => {
    return await UserMemory.find({
        userId: userId,
        isActive: true,
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
    memory: string,
    type: "goal" | "preferences" | "relationship" | "habits" | "other",
    expiresAt?: Date
) => {
    try {
        const memroyUpdated = await UserMemory.findByIdAndUpdate(
            memoryId,
            { $set: { content: memory, type, expiresAt } },
            { new: true }
        );
        return memroyUpdated;
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