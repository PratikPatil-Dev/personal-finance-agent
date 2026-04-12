import Conversation from "../models/conversation.model.js";

const getRecentConversations = async (userId: string, limit: number = 15) => {
    return await Conversation.find({
        userId: userId
    }).sort({ createdAt: -1 }).limit(limit);
}

const saveMessage = async (userId: string, role: "user" | "assistant" | "tool", content: string, toolName?: string, toolCallId?: string) => {

    const conversation = await Conversation.create({
        userId,
        role,
        content,
        toolName,
        toolCallId
    });

    return conversation;
}

export {
    getRecentConversations,
    saveMessage
}