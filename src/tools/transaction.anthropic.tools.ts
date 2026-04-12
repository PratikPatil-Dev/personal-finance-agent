

const addTransaction = {
    name: "add_transaction",
    description: "log a transaction user did, like an expense or any amount credited/debited",
    input_schema: {
        type: "object" as const,
        properties: {
            amount: {
                type: "number",
                description: "Transaction amount in numeric value",
            },
            type: {
                type: "string",
                enum: ["income", "expense", "transfer"],
                description: "Wheather this is money coming in or going out",
            },
            category: {
                type: "string",
                description: "category of transaction eg. food, travel, grocery, utility, salary, investment",
            },
            description: {
                type: "string",
                description: "details about transaction eg. where it was spent, to who, etc.",
            },
            source: {
                type: "string",
                enum: ["text", "receipt", "sheet"],
                description: "source of the transaction entry eg. text on telegram, photo of receipt or bill sent on telegram, added from uploaded excel sheet",
            },
            date: {
                type: "string",
                description: "Date of transaction in ISO format. Use today if not specified.",
            },
            currency: {
                type: "string",
                description: "Currency code e.g. INR, USD. Default INR.",
            }
        },
        required: ["amount", "type", "category", "description", "source", "date"],
    }
};

const updateTransaction = {
    name: "update_transaction",
    description: "update a transaction user corrected based on transactionId, like change in amount, or transaction category or description",
    input_schema: {
        type: "object" as const,
        properties: {
            transactionId: {
                type: "string",
                description: "Transaction Id of the transaction user wants to update",
            },
            amount: {
                type: "number",
                description: "Transaction amount in numeric value",
            },
            type: {
                type: "string",
                enum: ["income", "expense", "transfer"],
                description: "Wheather this is money coming in or going out",
            },
            category: {
                type: "string",
                description: "category of transaction eg. food, travel, grocery, utility, salary, investment",
            },
            description: {
                type: "string",
                description: "details about transaction eg. where it was spent, to who, etc.",
            },
            source: {
                type: "string",
                enum: ["text", "receipt", "sheet"],
                description: "source of the transaction entry eg. text on telegram, photo of receipt or bill sent on telegram, added from uploaded excel sheet",
            },
            date: {
                type: "string",
                description: "Date of transaction in ISO format. Use today if not specified.",
            },
            currency: {
                type: "string",
                description: "Currency code e.g. INR, USD. Default INR.",
            }
        },
        required: ["transactionId"],
    }
    };

const deleteTransaction = {
    name: "delete_transaction",
    description: "delete a transaction from database based on tarnsactionId",
    input_schema: {
        type: "object" as const,
        properties: {
            transactionId: {
                type: "string",
                description: "Transaction Id of the transaction user wants to update",
            },
        },
        required: ["transactionId"],
    }
};

const getTransactions = {
    name: "get_transactions",
    description: "get one ore more transactions from database based on user's provided information",
    input_schema: {
        type: "object" as const,
        properties: {
            startDate: {
                type: "string",
                description: "Start date of timeframe in ISO format e.g. 2026-03-01",
            },
            endDate: {
                type: "string",
                description: "End date of timeframe in ISO format e.g. 2026-03-01",
            },
            type: {
                type: "string",
                enum: ["income", "expense", "transfer"],
                description: "Wheather this is money coming in or going out",
            },
            category: {
                type: "string",
                description: "category of transaction eg. food, travel, grocery, utility, salary, investment",
            },
            limit: {
                type: "number",
                description: "number of transactions to retrieve from database",
            }
        },
    }
};

export const transactionTools = [addTransaction, updateTransaction, deleteTransaction, getTransactions];
