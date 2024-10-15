import express from 'express';
import bookingController from './booking.controller';

export default function registerHandlers(app: express.Application) {
  app.post('/book', bookingController.bookEvent);
  app.patch('/cancel/:booking_id', bookingController.cancelBooking);
}