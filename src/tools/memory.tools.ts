const addMemory = {
    type: "function",
    name: "add_memory",
    description: "add a important memory like users goals, plans, habbits, preferrances, relationships, etc.",
    parameters: {
        type: "object",
        properties: {
            memory: {
                type: "string",
                description: "event, goal, content that needs to be stored as a user's memory"
            },
            type: {
                type: "string",
                enum: ["goal", "preferences", "relationship", "habits", "other"],
                description: "Type of memory being stored"
            },
            expiryDate: {
                type: "string",
                description: "Date at which this memory should expire, eg. travel fund for september 2026"
            }
        },
        required: ["memory", "type"]
    }
};

const updateMemory = {
    type: "function",
    name: "update_memory",
    description: "update a important memory like chnage in goals, plans, habbits, preferrances, relationships, etc. based on memoryId and userId",
    parameters: {
        type: "object",
        properties: {
            memoryId: {
                type: "string",
                description: "memoryId to update the memory of"
            },
            memory: {
                type: "string",
                description: "updated event, goal, content that needs to be updated in user's memory"
            },
            expiryDate: {
                type: "string",
                description: "Date at which this memory should expire, eg. travel fund for september 2026"
            }
        },
        required: ["memoryId"]
    }
}

const getMemory = {
    type: "function",
    name: "get_memory",
    description: "get a important memory of user like their goals, plans, habbits, preferrances, relationships, etc. based on userId",
    parameters: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "Search query to find relevant memories e.g. 'drone goal' or 'salary'"
            }
        },
        required: ["query"]
    }
};

export const memoryTools = [addMemory, updateMemory, getMemory];