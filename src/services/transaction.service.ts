import Transaction from "../models/transaction.model.js";

const addTransaction = async (
    userId: string,
    data: {
        amount: number,
        type: "expense" | "income" | "transfer",
        category: string,
        description: string,
        source: string,
        date: string,
        currency?: string
    }) => {
    try {
        const result = await Transaction.create({
            userId,
            ...data
        });

        return result;
    } catch (error) {
        console.error("Error in addTransaction: ", error);
        throw error;
    }
}

// Every lookup below is scoped by userId as well as _id: the model supplies the
// transactionId, so matching on _id alone would let a hallucinated (but validly
// formed) id reach another user's row.
const updateTransaction = async (
    userId: string,
    data: {
        transactionId: string,
        amount?: number,
        type?: "expense" | "income" | "transfer",
        category?: string,
        description?: string,
        source?: string,
        date?: string,
        currency?: string
    }) => {
    try {
        const { transactionId, ...updates } = data;
        const result = await Transaction.findOneAndUpdate(
            { _id: transactionId, userId, isDeleted: false },
            updates,
            { new: true }
        );
        if (!result) {
            return { error: "No transaction found with that id for this user. Call get_transactions to find the correct id." };
        }
        return result;
    } catch (error) {
        console.error("Error in updateTransaction: ", error);
        throw error;
    }
}

const deleteTransaction = async (userId: string, transactionId: string) => {
    try {
        const result = await Transaction.findOneAndUpdate(
            { _id: transactionId, userId, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!result) {
            return { error: "No transaction found with that id for this user. Call get_transactions to find the correct id." };
        }
        return result;
    } catch (error) {
        console.error("Error in deleteTransaction: ", error);
        throw error;
    }
}

const getTransactions = async (
    userId: string,
    filters: {
        startDate?: string;
        endDate?: string;
        type?: "income" | "expense" | "transfer";
        category?: string;
        limit?: number;
    }
) => {
    try {
        const query: Record<string, unknown> = { userId, isDeleted: false };

        if (filters.type) query.type = filters.type;
        if (filters.category) query.category = filters.category;
        if (filters.startDate || filters.endDate) {
            const dateRange: Record<string, Date> = {};
            if (filters.startDate) dateRange.$gte = new Date(filters.startDate);
            if (filters.endDate) dateRange.$lte = new Date(filters.endDate);
            query.date = dateRange;
        }

        return await Transaction.find(query)
            .sort({ date: -1 })
            .limit(filters.limit ?? 50);
    } catch (error) {
        console.error("Error in getTransactions: ", error);
        throw error;
    }
};

export {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactions
}
