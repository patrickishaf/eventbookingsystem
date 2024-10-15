import {Request, Response} from 'express';
import { sendRpc } from '../amqp/rpc';
import config from '../config';
import { v4 as uuid } from 'uuid';

const eventController = {
  async initializeEvent(_: Request, res: Response) {
    try {
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