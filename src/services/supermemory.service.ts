import Supermemory from "supermemory"
import { config } from "../config/env.js";

const client = new Supermemory({
    apiKey: config.supermemoryApiKey
});

// Supermemory is extra context, not core: if it's down or the key is rejected,
// log and carry on so the bot still answers instead of failing every message.
const addPersistentMemory = async (userId: string, content: string) => {
    try {
        return await client.add({
            containerTag: userId,
            content
        });
    } catch (error) {
        console.error("Supermemory add failed, continuing without it:", error);
        return null;
    }
}

const searchPersistentMemory = async (userId: string, query: string) => {
    try {
        return await client.profile({
            containerTag: userId,
            q: query
        });
    } catch (error) {
        console.error("Supermemory search failed, continuing without it:", error);
        return null;
    }
}

export {
    addPersistentMemory,
    searchPersistentMemory
}
