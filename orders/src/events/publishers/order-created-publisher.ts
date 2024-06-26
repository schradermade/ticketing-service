import { Publisher, OrderCreatedEvent, Subjects } from '@tickets-market/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
