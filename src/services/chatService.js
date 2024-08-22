import { ChatManagerMONGO as ChatManager } from "../dao/ChatManagerMONGO.js";

class ChatService {
  constructor(dao) {
    this.dao = dao;
  }
  addMessage = async (chatName, message) => {
    return this.dao.addMessage(chatName, message);
  };
}

export const chatService = new ChatService(new ChatManager());
