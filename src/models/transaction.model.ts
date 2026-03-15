import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true, 
        default: "INR",
    },
    type: {
        type: String,
        required: true,
        enum: ["income", "expense", "transfer"],
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    source: {
        type: String,
        required: true,
        enum: ["text", "receipt", "sheet"],
    },
    date: {
        type: Date,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    tags: {
        type: [String],
        default: [],
    },
}, { timestamps: true });
transactionSchema.index({ userId: 1, date: -1 });
const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;