import { chatModel } from "./models/chatModel.js";

export class ChatManagerMONGO {
    addMessage = async (chatUser, chatMessage) => {
        return await chatModel.create({chatUser, chatMessage});         
    };
}