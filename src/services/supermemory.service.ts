import Supermemory from "supermemory"
import { config } from "../config/env.js";

const client = new Supermemory({
    apiKey: config.supermemoryApiKey
});

const addPersistentMemory = async (userId: string, content: string) => {
    return await client.add({
        containerTag: userId,
        content
    });
}

const searchPersistentMemory = async (userId: string, query: string) => {
    return await client.profile({
        containerTag: userId,
        q: query
    });
}

export {
    addPersistentMemory,
    searchPersistentMemory
}