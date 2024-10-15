import {Request, Response} from 'express';
import { sendRpc } from '../amqp/rpc';
import config from '../config';
import { v4 as uuid } from 'uuid';
import Joi from 'joi';
import { validateSchema } from '../utils';

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
      const response = await sendRpc(config.waitlistQueue!, { data: 'test data in queue'}, uuid());
      console.log({ response });
      return res.status(201).json({ message: 'initialized event', data: response });
    } catch (err: any) {
      return res.status(500).json(err.message)
    }
  },
  async getEventStatus(req: Request, res: Response) {
    return res.status(200).json('fetched event status');
  },
};

export default eventController;