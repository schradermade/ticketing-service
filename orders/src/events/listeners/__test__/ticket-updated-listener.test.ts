import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedEvent } from "@tickets-market/common"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import { Ticket } from "../../../models/ticket"

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 24
  })
  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 13.50,
    userId: 'asdawef'
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }
  return { listener, data, msg, ticket };
}

it('finds, updates, and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);

})

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
})

it('does not call ack() if the event has a skipped version number', async () => {
  const { msg, data, listener } = await setup();

  data.version = 10;
  
  // wrap in try-catch so it does not throw error
  // inside the test. rather, it will fail test in expect()
  try {
    await listener.onMessage(data, msg);
  } catch (error) {
  }

  expect(msg.ack).not.toHaveBeenCalled();

})