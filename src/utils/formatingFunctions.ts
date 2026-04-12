import { IConversation } from "../models/conversation.model.js";
import { IUserMemory } from "../models/userMemory.model.js";

const formatConversations = (conversations: IConversation[]): string => {
    const sortedConversations = conversations.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    return sortedConversations.map(conversation => {
        return `${conversation.role}: ${conversation.content}`;
    }).join("\n");
}

const formatLocalMemories = (memories: IUserMemory[]): string => {
    return memories.map(memory => {
        return `${memory.type}: ${memory.content}`;
    }).join("\n");
}

const formatPersistentMemories = (memories: any): string => {
    return memories?.map((memory: any) => {
        return `memory: ${memory.content}`;
    }).join("\n");
}

export {
    formatConversations,
    formatLocalMemories,
    formatPersistentMemories
}
