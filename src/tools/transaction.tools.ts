const addTransaction = {
    type: "function",
    name: "add_transaction",
    description: "log a transaction user did, like an expense or any amount credited/debited",
    parameters: {
        type: "object",
        properties: {
            amount: {
                type: "number",
                description: "Transaction amount in numeric value"
            },
            type: {
                type: "string",
                enum: ["income", "expense", "transfer"],
                description: "Whether this is money coming in or going out"
            },
            category: {
                type: "string",
                description: "category of transaction eg. food, travel, grocery, utility, salary, investment"
            },
            description: {
                type: "string",
                description: "details about transaction eg. where it was spent, to who, etc."
            },
            source: {
                type: "string",
                enum: ["text", "receipt", "sheet"],
                description: "source of the transaction entry eg. text on telegram, photo of receipt or bill sent on telegram, added from uploaded excel sheet",
            },
            date: {
                type: "string",
                description: "Date of transaction in ISO format. Use today if not specified."
            },
            currency: {
                type: "string",
                description: "Currency code e.g. INR, USD. Default INR."
            }

        },
        required: ["amount", "type", "category", "description", "source", "date"]
    }
}

const updateTransaction = {
    type: "function",
    name: "update_transaction",
    description: "update a transaction user corrected based on transactionId, like change in amount, or transaction category or description",
    parameters: {
        type: "object",
        properties: {
            transactionId: {
                type: "string",
                description: "Transaction Id of the transaction user wants to update"
            },
            amount: {
                type: "number",
                description: "Transaction amount in numeric value"
            },
            type: {
                type: "string",
                enum: ["income", "expense", "transfer"],
                description: "Whether this is money coming in or going out"
            },
            category: {
                type: "string",
                description: "category of transaction eg. food, travel, grocery, utility, salary, investment"
            },
            description: {
                type: "string",
                description: "details about transaction eg. where it was spent, to who, etc."
            },
            source: {
                type: "string",
                enum: ["text", "receipt", "sheet"],
                description: "source of the transaction entry eg. text on telegram, photo of receipt or bill sent on telegram, added from uploaded excel sheet",
            },
            date: {
                type: "string",
                description: "Date of transaction in ISO format. Use today if not specified."
            },
            currency: {
                type: "string",
                description: "Currency code e.g. INR, USD. Default INR."
            }

        },
        required: ["transactionId"]
    }
}

const deleteTransaction = {
    type: "function",
    name: "delete_transaction",
    description: "delete a transaction from database based on transactionId",
    parameters: {
        type: "object",
        properties: {
            transactionId: {
                type: "string",
                description: "Transaction Id of the transaction user wants to update"
            },
        },
        required: ["transactionId"]
    }
}

const getTransaction = {
    type: "function",
    name: "get_transaction",
    description: "get one or more transactions from database based on user's provided information",
    parameters: {
        type: "object",
        properties: {
            startDate: {
                type: "string",
                description: "Start date of timeframe in ISO format e.g. 2026-03-01"
            },
            endDate: {
                type: "string",
                description: "End date of timeframe in ISO format e.g. 2026-03-01"
            },
            type: {
                type: "string",
                enum: ["income", "expense", "transfer"],
                description: "Whether this is money coming in or going out"
            },
            category: {
                type: "string",
                description: "category of transaction eg. food, travel, grocery, utility, salary, investment"
            },
            limit: {
                type: "number",
                description: "number of transactions to retrieve from database"
            }

        },
    }
}
export const transactionTools = [
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction
];