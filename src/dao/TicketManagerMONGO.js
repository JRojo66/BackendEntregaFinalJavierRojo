import {ticketModel} from "./models/ticketModel.js"

export class TicketManagerMONGO {
    add = async (ticket) => {                                                                            // cuando tenga el Service instanciando la clase, sacar todos los static
      let newTicket = await ticketModel.create(ticket);   
        return newTicket.toJSON();
      }

    update = async (code, purchase_datetime) => {         
    let updatedTicket = await ticketModel.findOneAndUpdate(
      { code },
      { $set: { purchase_datetime: purchase_datetime } },
      { new: true }
    );
    return updatedTicket.toJSON();
    }


}