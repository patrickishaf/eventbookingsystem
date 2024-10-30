import { Request, Response } from 'express';
import Joi from 'joi';
import { validateSchema } from '../utils';
import { publishMessage, sendRpc } from '../amqp/rpc.queue';
import config from '../config';
import { OutgoingEvents } from '../amqp/events';
import { Event } from '../models/event';
import bookingService from '../services/booking.service';
import { Booking } from '../models/booking';

const bookingController = {
  async bookEvent(req: Request, res: Response) {
    try {
      const schema = Joi.object({
        event_id: Joi.number().required(),
        user_email: Joi.string().required(),
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
      });
      const errorMsg = await validateSchema(schema, req.body);
      if (errorMsg) {
        return res.status(400).json(errorMsg);
      }

      const { event_id, user_email, first_name, last_name } = req.body;
      const rpcData = { event_id };
      const eventData = await sendRpc(config.eventRpcQueue!, { event: OutgoingEvents.eventInfo, data: rpcData });
      if (!eventData) {
        return res.status(403).json('failed to find matching event');
      }
      
      if ((eventData as Event).remaining_tickets > 0) {
        // create a normal booking
        const payload: Partial<Booking> = {
          event_id,
          user_email,
        }
        if (first_name) payload.first_name = first_name;
        if (last_name) payload.last_name = last_name;

        const booking = await bookingService.createBooking(payload);
        const msg = { event_id };
        await publishMessage(config.eventQueue!, { event: OutgoingEvents.decrementTickets, data: msg });
        return res.status(201).json(booking);
      } else {
        // tell waitlist service to add user to waitlist
        const waitingListMember: any = {
          event_id,
          user_email
        };
        if (first_name) waitingListMember.first_name = first_name;
        if (last_name) waitingListMember.last_name = last_name;

        await publishMessage(config.waitlistQueue!, { event: OutgoingEvents.addToWaitlist, data: waitingListMember });
        return res.status(200).json('tickets have been sold out. you have been added to the waiting list');
      }
    } catch (err: any) {
      console.log('failed to create booking. error:', err.message);
      return res.status(500).json(err.message);
    }
  },

  async cancelBooking(req: Request, res: Response) {
    return res.status(200).json('booking cancelled successfully');
  }
};

export default bookingController;