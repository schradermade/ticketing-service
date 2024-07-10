import mongoose from "mongoose"
import {  OrderCancelledEvent, OrderStatus } from "@tickets-market/common"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Message } from "node-nats-streaming"
import { Order } from "../../../models/order"

const setup = async () => {
  // listener
  const listener = new OrderCancelledListener(natsWrapper.client)

  // create order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: 'asdf',
    version: 0
  })
  await order.save()
  
  // data
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'asdf'
    }
  }

  // msg
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, order, data, msg };
}

it('updates the status of the order', async () => {
  const { listener, order, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  if (!updatedOrder) {
    throw new Error('No order found')
  }

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
})

it('acks the message', async () => {
  const { listener, order, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
})