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
        console.log("Error in addTransaction: ", error);
        throw error;
    }
}

const updateTransaction = async (
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
            const result = await Transaction.findByIdAndUpdate(transactionId, updates, { new: true });
            return result;
        } catch (error) {
            console.log("Error in updateTransaction: ", error);
            throw error;
        }
    
}

const deleteTransaction = async (transactionId: string) => {
    try {
        const result = await Transaction.findByIdAndUpdate(transactionId, { isDeleted: true });
        return result;
    } catch (error) {
        console.log("Error in deleteTransaction: ", error);
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
        
   
    const query: any = { userId, isDeleted: false };

    if (filters.type) query.type = filters.type;
    if (filters.category) query.category = filters.category;
    if (filters.startDate || filters.endDate) {
        query.date = {};
        if (filters.startDate) query.date.$gte = new Date(filters.startDate);
        if (filters.endDate) query.date.$lte = new Date(filters.endDate);
    }

    return await Transaction.find(query)
        .sort({ date: -1 })
        .limit(filters.limit ?? 50);
    } catch (error) {
        console.log("Error in getTransactions: ", error);
        throw error;
    }
};

export {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactions
}