import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        tgUserId: {
            type: Number,
            required: true,
            unique: true,
        },
        tgChatId: {
            type: Number,
            required: true,
            unique: true,
        },
        name: {
            type: String,
        },
        username: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;