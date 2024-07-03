import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from "@tickets-market/common";
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString() || '';

  const ticket = Ticket.build({
    title: 'concert',
    price: 19.99,
    userId: 'asdfasdf',
  })
  ticket.set({ orderId })
  await ticket.save();

  // build data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    }
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { msg, data, ticket, orderId, listener };
}

it('updates the ticket, publishes an event, and acks the message', async () => {
  const { data, ticket, msg, listener, orderId } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id)

  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
})