import express from 'express';
import cors from 'cors';
import eventController from './event.controller';

export default function registerHandlers(app: express.Application) {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  app.post('/initialize', eventController.initializeEvent);
  app.get('/status/:event_id', eventController.getEventStatus);
}