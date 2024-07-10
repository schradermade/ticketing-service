import { Publisher, ExpirationCompleteEvent, Subjects } from "@tickets-market/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}