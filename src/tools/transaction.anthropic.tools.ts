import { z } from "zod";
import type Anthropic from "@anthropic-ai/sdk";

const toInputSchema = (schema: z.ZodType): Anthropic.Tool.InputSchema =>
    z.toJSONSchema(schema) as Anthropic.Tool.InputSchema;

const transactionTypeEnum = z.enum(["income", "expense", "transfer"]);
const transactionSourceEnum = z.enum(["text", "receipt", "sheet"]);

export const AddTransactionSchema = z.object({
    amount: z.number().describe("Transaction amount in numeric value"),
    type: transactionTypeEnum.describe("Wheather this is money coming in or going out"),
    category: z.string().describe("category of transaction eg. food, travel, grocery, utility, salary, investment"),
    description: z.string().describe("details about transaction eg. where it was spent, to who, etc."),
    source: transactionSourceEnum.describe("source of the transaction entry eg. text on telegram, photo of receipt or bill sent on telegram, added from uploaded excel sheet"),
    date: z.string().describe("Date of transaction in ISO format. Use today if not specified."),
    currency: z.string().optional().describe("Currency code e.g. INR, USD. Default INR."),
});
export type AddTransactionInput = z.infer<typeof AddTransactionSchema>;

const addTransaction = {
    name: "add_transaction",
    description: "log a transaction user did, like an expense or any amount credited/debited",
    input_schema: toInputSchema(AddTransactionSchema),
};

export const UpdateTransactionSchema = z.object({
    transactionId: z.string().describe("Transaction Id of the transaction user wants to update"),
    amount: z.number().optional().describe("Transaction amount in numeric value"),
    type: transactionTypeEnum.optional().describe("Wheather this is money coming in or going out"),
    category: z.string().optional().describe("category of transaction eg. food, travel, grocery, utility, salary, investment"),
    description: z.string().optional().describe("details about transaction eg. where it was spent, to who, etc."),
    source: transactionSourceEnum.optional().describe("source of the transaction entry eg. text on telegram, photo of receipt or bill sent on telegram, added from uploaded excel sheet"),
    date: z.string().optional().describe("Date of transaction in ISO format. Use today if not specified."),
    currency: z.string().optional().describe("Currency code e.g. INR, USD. Default INR."),
});
export type UpdateTransactionInput = z.infer<typeof UpdateTransactionSchema>;

const updateTransaction = {
    name: "update_transaction",
    description: "Update an existing transaction. IMPORTANT: You must have a real MongoDB transaction ID from a previous get_transactions call. Never guess or fabricate a transactionId. If you don't have a real ID, call get_transactions first to find it.",
    input_schema: toInputSchema(UpdateTransactionSchema),
};

export const DeleteTransactionSchema = z.object({
    transactionId: z.string().describe("Transaction Id of the transaction user wants to update"),
});
export type DeleteTransactionInput = z.infer<typeof DeleteTransactionSchema>;

const deleteTransaction = {
    name: "delete_transaction",
    description: "delete a transaction from database based on tarnsactionId",
    input_schema: toInputSchema(DeleteTransactionSchema),
};

export const GetTransactionsSchema = z.object({
    startDate: z.string().optional().describe("Start date of timeframe in ISO format e.g. 2026-03-01"),
    endDate: z.string().optional().describe("End date of timeframe in ISO format e.g. 2026-03-01"),
    type: transactionTypeEnum.optional().describe("Wheather this is money coming in or going out"),
    category: z.string().optional().describe("category of transaction eg. food, travel, grocery, utility, salary, investment"),
    limit: z.number().optional().describe("number of transactions to retrieve from database"),
});
export type GetTransactionsInput = z.infer<typeof GetTransactionsSchema>;

const getTransactions = {
    name: "get_transactions",
    description: "get one ore more transactions from database based on user's provided information",
    input_schema: toInputSchema(GetTransactionsSchema),
};

export const transactionTools = [addTransaction, updateTransaction, deleteTransaction, getTransactions];
