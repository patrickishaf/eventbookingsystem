import {Request, Response} from 'express';
import { sendRpc } from '../amqp/rpc.queue';
import { publishMessage } from '../amqp/message.queue';
import config from '../config';
import Joi from 'joi';
import { validateSchema } from '../utils';
import { OutgoingEvents } from '../amqp/events';
import { Event, findEventById } from '../models/event';
import eventService from '../services/event.service';

const eventController = {
  async initializeEvent(req: Request, res: Response) {
    try {
      const schema = Joi.object({
        name: Joi.string().required(),
        desc: Joi.string().optional(),
        total_tickets: Joi.string().optional(),
      });
      const errorMsg = await validateSchema(schema, req.body);
      if (errorMsg) {
        return res.status(400).json('failed to initialize event');
      }

      const { name, desc, total_tickets } = req.body;
      const newEventData: Partial<Event> = {
        name,
        total_tickets,
        remaining_tickets: total_tickets,
      }
      if (desc) newEventData.description = desc;
      
      const newEvent = await eventService.createNewEvent(newEventData);
      console.log('created event:', newEvent);
      
      publishMessage(config.waitlistQueue!, { event: OutgoingEvents.createWaitlist });
      return res.status(201).json({ message: 'initialized event', data: newEvent });
    } catch (err: any) {
      console.log('failed to create event. error:', err.message);
      return res.status(500).json(err.message)
    }
  },
  async getEventStatus(req: Request, res: Response) {
    try {
      const schema = Joi.object({
        event_id: Joi.string().required(),
      });
      const errorMsg = await validateSchema(schema, req.params);
      if (errorMsg) {
        return res.status(400).json('failed to get event status');
      }

      const { event_id } = req.params;
      const event = await findEventById(Number(event_id));
      if (!event) {
        return res.status(400).json(`event with id ${event_id} does not exist`);
      }
      const existingBookings = await sendRpc(config.bookingRpcQueue!, { event: OutgoingEvents.bookingInfo, data: { event_id: Number(event_id) }});
      const waitingList = await sendRpc(config.waitlistRpcQueue!, { event: OutgoingEvents.getWaitlist, data: { event_id: Number(event_id) }});

      const responseBody: any = {
        ...event,
        bookings: { count: 0, data: [] },
        waiting_list: { count: 0, data: [] },
      };
      
      if (existingBookings && (existingBookings as any[]).length > 0) {
        responseBody.bookings = {
          count: (existingBookings as any[]).length,
          data: existingBookings,
        }
      }
      if (waitingList && (waitingList as any[]).length > 0) {
        responseBody.waiting_list = {
          count: (waitingList as any[]).length,
          data: waitingList,
        }
      }
      return res.status(200).json(responseBody);
    } catch (err: any) {
      console.error('failed to get event status. error:', err.message);
      return res.status(500).json(err.message);
    }
  },
};

export default eventController;