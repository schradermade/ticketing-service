import express, { Request, Response } from "express";
import { NotAuthorizedError, NotFoundError, requireAuth } from "@tickets-market/common";
import { Order, OrderStatus } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router()

router.patch(
  '/api/orders:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { currentUser } = req
    const { orderId } = req.params

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== currentUser!.id) {
      throw new NotAuthorizedError();
    }
    
    order.status = OrderStatus.Cancelled
    await order.save()

    // publishing an event sayigng this was cancelled
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.id,
        ticket: {
          id: order.ticket.id
        }
    })

    res.status(204).send(order)
  })
  
  export { router as deleteOrderRouter };