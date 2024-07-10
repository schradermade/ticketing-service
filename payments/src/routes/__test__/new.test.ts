import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@tickets-market/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

// jest.mock('../../stripe');

it('returns 404 if order does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getAuthCookie())
    .send({
      token: '1234',
      orderId: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(404);
})

it('returns 401 error if userId of order does not match current user id', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 10,
    status: OrderStatus.Created
  })
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getAuthCookie())
    .send({
      token: 'asdf',
      orderId: order.id,
    })
    .expect(401)
})

it('returns 400 if order status is in Cancelled state', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 10,
    status: OrderStatus.Cancelled
  })
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getAuthCookie(userId))
    .send({
      orderId: order.id,
      token: 'asdf'
    })
    .expect(400)
})

it('returns a 201 with valid inputs', async () => {
  const price = Math.floor(Math.random() * 1000)
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created
  })
  await order.save();

  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', global.getAuthCookie(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id
    })
    .expect(201);

  
  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find(charge => charge.amount === price * 100)

  expect(stripeCharge!.currency).toEqual('usd');
  expect(stripeCharge!.amount).toEqual(price * 100);

  const payment = await Payment.findOne({ 
    orderId: order.id, 
    stripeId: stripeCharge!.id
  })

  expect(payment).not.toBeNull();
  expect(payment?.id).toEqual(response.body.id)
})
