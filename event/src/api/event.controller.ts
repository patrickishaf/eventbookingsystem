import {Request, Response} from 'express';
import { sendRpc } from '../amqp/rpc.queue';
import { publishMessage } from '../amqp/message.queue';
import config from '../config';
import Joi from 'joi';
import { validateSchema } from '../utils';
import { OutgoingEvents } from '../amqp/events';
import { Event } from '../models/event';
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
    return res.status(200).json('fetched event status');
  },
};

export default eventController;