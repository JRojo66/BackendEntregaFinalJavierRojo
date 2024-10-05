import { ChatDaoMONGO as ChatDao } from "../dao/ChatDaoMONGO.js";

class ChatService {
  constructor(dao) {
    this.dao = dao;
  }
  addMessage = async (chatName, message) => {
    return this.dao.addMessage(chatName, message);
  };  
  getMessages = async () => {
    return this.dao.getMessages();
  }
  deleteOldMessages = async (expireDate) => {
    return this.dao.deleteOldMessages(expireDate);
  }
}

export const chatService = new ChatService(new ChatDao());
