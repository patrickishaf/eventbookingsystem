import eventService from '../services/event.service';
import { IncomingEvents } from './events';

export default async function handleQueueMessage(payload: any) {
  const { event = 'name', data = 'data' } = payload;
  console.log({ event, data });
  switch (event) {
    case IncomingEvents.decrementTickets:
      return await eventService.decrementEventTickets(data.event_id);
    case IncomingEvents.eventInfo:
      return await eventService.getEventInfo(data.event_id);
  
    default:
      console.log('unrecognized event');
      return 'unrecognized event';
      break;
  }
}