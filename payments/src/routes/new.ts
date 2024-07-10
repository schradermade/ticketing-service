import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@tickets-market/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token')
      .not()
      .isEmpty(),
    body('orderId')
      .not()
      .isEmpty()
  ],
  validateRequest,
  async (req: Request, res: Response)  => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    // if order is not found
    if (!order) {
      throw new NotFoundError();
    }
    // if userId of order does not match the id of current user
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    // if order status is in cancelled state
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for a cancelled order');
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
      description: `Your payment for ${order.price} was successful!`
    })

    const payment = Payment.build({
      orderId,
      stripeId: charge.id
    })
    await payment.save();
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.id
    });

    res.status(201).send({ id: payment.id });
})

export { router as createChargeRouter};