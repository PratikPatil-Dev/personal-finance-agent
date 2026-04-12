const addMemory = {
    name: "add_memory",
    description: "add a important memory like users goals, plans, habbits, preferrances, relationships, etc.",
    input_schema: {
        type: "object" as const,
        properties: {
            memory: {
                type: "string",
                description: "event, goal, content that needs to be stored as a user's memory",
            },
            type: {
                type: "string",
                enum: ["goal", "preferences", "relationship", "habits", "other"],
                description: "Type of memory being stored",
            },
            expiryDate: {
                type: "string",
                description: "Date at which this memory should expire, eg. travel fund for september 2026",
            }
        },
        required: ["memory", "type"],
    }
};

const updateMemory = {
    name: "update_memory",
    description: "Search existing memories before adding a new one. Always call this first when user mentions goals, preferences, or plans to check if a similar memory already exists. Update based on memoryId and userId",
    input_schema: {
        type: "object" as const,
        properties: {
            memoryId: {
                type: "string",
                description: "memoryId to update the memory of",
            },
            memory: {
                type: "string",
                description: "updated event, goal, content that needs to be updated in user's memory",
            },
            expiryDate: {
                type: "string",
                description: "Date at which this memory should expire, eg. travel fund for september 2026",
            }
    },
    required: ["memoryId"],
}
};

const getMemory = {
    name: "get_memory",
    description: "get a important memory of user like their goals, plans, habbits, preferrances, relationships, etc. based on userId",
    input_schema: {
        type: "object" as const,
        properties: {
            query: {
                type: "string",
                description: "Search query to find relevant memories e.g. 'drone goal' or 'salary'",
            }
        },
        required: ["query"],
    }
};

export const memoryTools = [addMemory, updateMemory, getMemory];
