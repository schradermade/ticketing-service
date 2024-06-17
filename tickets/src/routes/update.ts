import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest, 
  NotFoundError, 
  requireAuth, 
  NotAuthorizedError 
} from '@tickets-market/common'
import { Ticket } from '../models/ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router()

router.put(
  '/api/tickets/:id', 
  requireAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    throw new NotFoundError()
  }

  if (ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  // set new properties on the ticket
  // this ONLY makes updates to Document in memory
  // does not persist back to mongodb
  ticket.set({
    title: req.body.title,
    price: req.body.price
  })
  // here, we actually save it back to db
  await ticket.save()
  // emit update event
  new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId
  })
  
  res.send(ticket)
})

export { router as updateTicketRouter };