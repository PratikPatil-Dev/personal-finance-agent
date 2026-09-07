import { IUserMemory } from "../models/userMemory.model.js";

const formatLocalMemories = (memories: IUserMemory[]): string => {
    return memories.map(memory => {
        return `${memory.type}: ${memory.content}`;
    }).join("\n");
}

interface PersistentMemories {
    profile?: { dynamic?: unknown[] };
    searchResults?: { results?: unknown[] };
}

// Supermemory types search results as unknown[], so pull `memory` off defensively
// rather than asserting a shape the SDK doesn't guarantee.
const extractMemoryText = (result: unknown): string | null => {
    if (typeof result === "string") return result;
    if (result && typeof result === "object" && "memory" in result) {
        const memory = (result as { memory: unknown }).memory;
        if (typeof memory === "string") return memory;
    }
    return null;
};

const formatPersistentMemories = (persistentMemories: PersistentMemories | null | undefined): string => {
    if (!persistentMemories) return "";

    const dynamic = (persistentMemories.profile?.dynamic ?? [])
        .map(extractMemoryText)
        .filter((text): text is string => text !== null);

    const searchResults = (persistentMemories.searchResults?.results ?? [])
        .map(extractMemoryText)
        .filter((text): text is string => text !== null);

    const profileContext = dynamic.length > 0
        ? `User Profile:\n${dynamic.join("\n")}`
        : "";

    const searchContext = searchResults.length > 0
        ? `Relevant Context:\n${searchResults.join("\n")}`
        : "";

    return [profileContext, searchContext].filter(Boolean).join("\n\n");
};

export {
    formatLocalMemories,
    formatPersistentMemories
}
