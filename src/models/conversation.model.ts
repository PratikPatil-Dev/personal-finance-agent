import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["user", "assistant", "tool"],
    },
    toolName: {
        type: String,
        required: false,
    },
    toolCallId: {
        type: String,
        required: false,
    },
}, { timestamps: true });

conversationSchema.index({ userId: 1, createdAt: -1 });
const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;

export interface IConversation {
    userId: mongoose.Types.ObjectId;
    role: "user" | "assistant" | "tool";
    content: mongoose.Schema.Types.Mixed;
    toolCallId?: string;
    toolName?: string;
    createdAt: Date;
}