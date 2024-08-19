import { TicketManagerMONGO as TicketManager } from "../dao/TicketManagerMONGO.js";  

class TicketService {
    constructor(dao) {
        this.dao = dao;
    }

    addTicket = async (ticket) => {
        return this.dao.add(ticket);
    };

    update = async (code, date) => {
        return this.dao.update(code, date);
    };
}
export const ticketService = new TicketService(new TicketManager());
