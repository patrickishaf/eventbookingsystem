import {Request, Response} from 'express';

const eventController = {
  initializeEvent(req: Request, res: Response) {
    return res.status(201).json('initialized event');
  },
  getEventStatus(req: Request, res: Response) {
    return res.status(200).json('fetched event status');
  },
};

export default eventController;