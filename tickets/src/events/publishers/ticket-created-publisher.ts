import { Publisher, Subjects, TicketCreatedEvent } from "@tickets-market/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
