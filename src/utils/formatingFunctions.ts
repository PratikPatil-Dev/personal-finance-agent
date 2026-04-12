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

const formatPersistentMemories = (persistentMemories: any): string => {
    if (!persistentMemories) return "";

    const dynamic = persistentMemories?.profile?.dynamic ?? [];
    const searchResults = persistentMemories?.searchResults?.results ?? [];

    const profileContext = dynamic.length > 0
        ? `User Profile:\n${dynamic.join("\n")}`
        : "";

    const searchContext = searchResults.length > 0
        ? `Relevant Context:\n${searchResults.map((r: any) => r.memory).join("\n")}`
        : "";

    return [profileContext, searchContext].filter(Boolean).join("\n\n");
};

export {
    formatConversations,
    formatLocalMemories,
    formatPersistentMemories
}
