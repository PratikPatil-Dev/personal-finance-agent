import mongoose from "mongoose";

const userMemorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        enum: ["goal", "preferences", "relationship", "habits", "other"],
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

userMemorySchema.index({ userId: 1, isActive: 1 }); 
const UserMemory = mongoose.model("UserMemory", userMemorySchema);
export default UserMemory;

export interface IUserMemory {
    userId: mongoose.Types.ObjectId;
    type: "goal" | "preferences" | "relationship" | "habits" | "other";
    content: string;
    expiresAt?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}