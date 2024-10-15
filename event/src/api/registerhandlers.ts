import express from 'express';
import eventController from './event.controller';

export default function registerHandlers(app: express.Application) {
  app.post('/initialize', eventController.initializeEvent);
  app.get('/status/:event_id', eventController.getEventStatus);
}