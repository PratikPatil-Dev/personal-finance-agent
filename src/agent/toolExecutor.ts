import { addMemory, getMemory, updateMemory } from "../services/memory.service.js";
import { addTransaction, deleteTransaction, getTransactions, updateTransaction } from "../services/transaction.service.js";
import {
    AddMemorySchema,
    UpdateMemorySchema,
    GetMemorySchema,
} from "../tools/memory.anthropic.tools.js";
import {
    AddTransactionSchema,
    UpdateTransactionSchema,
    DeleteTransactionSchema,
    GetTransactionsSchema,
} from "../tools/transaction.anthropic.tools.js";

const isValidObjectId = (id: unknown): id is string =>
    typeof id === "string" && /^[a-f\d]{24}$/i.test(id);

export const toolExecuter = async (toolName: string, input: unknown, userId: string) => {
    console.log("toolName", toolName, input)
    switch (toolName) {
        case "add_transaction": {
            const parsed = AddTransactionSchema.parse(input);
            return await addTransaction(userId, parsed);
        }
        case "update_transaction": {
            const parsed = UpdateTransactionSchema.parse(input);
            if (!isValidObjectId(parsed.transactionId)) {
                return { error: "Invalid transactionId. Call get_transactions first to find the real ID." };
            }
            return await updateTransaction(parsed);
        }
        case "delete_transaction": {
            const parsed = DeleteTransactionSchema.parse(input);
            if (!isValidObjectId(parsed.transactionId)) {
                return { error: "Invalid transactionId. Call get_transactions first to find the real ID." };
            }
            return await deleteTransaction(parsed.transactionId);
        }
        case "get_transactions": {
            const parsed = GetTransactionsSchema.parse(input);
            return await getTransactions(userId, parsed);
        }
        case "add_memory": {
            const parsed = AddMemorySchema.parse(input);
            return await addMemory(userId, parsed.type, parsed.memory, parsed.expiryDate ? new Date(parsed.expiryDate) : undefined);
        }
        case "update_memory": {
            const parsed = UpdateMemorySchema.parse(input);
            return await updateMemory(parsed.memoryId, parsed.memory, parsed.type, parsed.expiryDate ? new Date(parsed.expiryDate) : undefined);
        }
        case "get_memory": {
            const parsed = GetMemorySchema.parse(input);
            return await getMemory(userId, parsed.query);
        }
        default:
            throw new Error(`Unknown tool: ${toolName}`);
    }
}
