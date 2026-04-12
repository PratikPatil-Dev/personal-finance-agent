import { addMemory, getMemory, updateMemory } from "../services/memory.service.js";
import { addTransaction, deleteTransaction, getTransactions, updateTransaction } from "../services/transaction.service.js";

export const toolExecuter = async (toolName: string, input: any, userId: string) => {
    switch (toolName) {
        case "add_transaction":
            return await addTransaction(userId, input);
        case "update_transaction":
            return await updateTransaction(input);
        case "delete_transaction":
            return await deleteTransaction(input.transactionId);
        case "get_transactions":
            return await getTransactions(userId, input);
        case "add_memory":
            return await addMemory(userId, input.type, input.memory, input.expiryDate);
        case "update_memory":
            return await updateMemory(input.memoryId, input.memory, input.type, input.expiryDate);
        case "get_memory":
            return await getMemory(userId);
        default:
            throw new Error(`Unknown tool: ${toolName}`);
    }
}