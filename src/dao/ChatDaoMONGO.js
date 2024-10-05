import { chatModel } from "./models/chatModel.js";

export class ChatDaoMONGO {
    addMessage = async (chatName, message) => {
        return await chatModel.create({chatName, message});         
    };
    getMessages = async () => {
        return await chatModel.find().lean();
    }
    deleteOldMessages = async(expireDate) => {
        return await chatModel.deleteMany({ createdAt: { $lt: expireDate } });
    }
}