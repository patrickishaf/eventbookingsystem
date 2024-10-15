import { Request, Response } from 'express';

const bookingController = {
  bookEvent(req: Request, res: Response) {
    return res.status(201).json('booked event successfully');
  },
  cancelBooking(req: Request, res: Response) {
    return res.status(200).json('booking cancelled successfully');
  }
};

export default bookingController;