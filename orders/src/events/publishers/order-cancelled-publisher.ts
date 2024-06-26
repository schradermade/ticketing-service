import { OrderCancelledEvent, Publisher, Subjects } from "@tickets-market/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}