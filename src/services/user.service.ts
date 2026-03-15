import User from "../models/user.model.js";

export const findOrCreateUser = async (
    tgUserId: number,
    tgChatId: number,
    name: string,
    username: string | undefined
) => {
    try {
        const existingUser = await User.findOne({ tgUserId });

        if (existingUser) {
            return { isNew: false, user: existingUser };
        }

        const newUser = await User.create({ tgUserId, tgChatId, name, username });
        return { isNew: true, user: newUser };

    } catch (error) {
        console.error("Error finding or creating user", error);
        throw error;
    }
};