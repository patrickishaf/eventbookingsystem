import express from 'express';
import cors from 'cors';
import bookingController from './booking.controller';

export default function registerHandlers(app: express.Application) {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.post('/book', bookingController.bookEvent);
  app.patch('/cancel/:booking_id', bookingController.cancelBooking);
}