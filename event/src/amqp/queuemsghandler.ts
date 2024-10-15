import eventService from '../services/event.service';
import { IncomingEvents } from './events';

export default async function handleQueueMessage(payload: any) {
  const { event, data } = payload;
  switch (event) {
    case IncomingEvents.eventInfo:
      return await eventService.getEventInfo(data.event_id);
  
    default:
      console.log('unrecognized event');
      break;
  }
}