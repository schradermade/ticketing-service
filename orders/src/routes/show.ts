import express, { Request, Response } from "express";
import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth } from '@tickets-market/common';
import { Order } from "../models/order";
import mongoose from "mongoose";

const router = express.Router()

router.get(
  '/api/orders/:orderId', 
  requireAuth, 
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new BadRequestError('Invalid DB Id.')
    }
    
    const order = await Order.findById(orderId).populate('ticket');
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

  res.status(200).json(order);
})

export { router as showOrderRouter };

