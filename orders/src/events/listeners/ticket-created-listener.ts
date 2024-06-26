import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@tickets-market/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    // deconstruct title and price from data object
    const { id, title, price } = data;
    // create ticket from title and price
    const ticket = Ticket.build({
      id,
      title,
      price
    });
    // save that ticket to mongo db
    await ticket.save();

    // acknowledge processed msg event to NATS
    msg.ack();
  }
}