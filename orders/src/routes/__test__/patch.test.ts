import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('should successfully update status property to Cancelled', async () => {
  
  // create ticket with Ticket model
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  })
  await ticket.save()
  
  const user = global.getAuthCookie();
  
  // make request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id})
    .expect(201);

  // make request to cancel the order
  await request(app)
    .patch(`/api/orders${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  // expectation to make sure the thing is cancelled
  const cancelledOrder = await Order.findById(order.id)
  expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits an order cancelled event', async () => {
  const user = global.getAuthCookie();

  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  })
  await ticket.save()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id})
    .expect(201);

  await request(app)
  .patch(`/api/orders${order.id}`)
  .set('Cookie', user)
  .send()
  .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});