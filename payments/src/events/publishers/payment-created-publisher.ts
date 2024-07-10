import { Publisher, PaymentCreatedEvent, Subjects } from "@tickets-market/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}