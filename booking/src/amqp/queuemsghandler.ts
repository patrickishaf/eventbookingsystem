import { IncomingEvents } from "./events";

export default async function handleQueueMessage(payload: any) {
  const { event, data } = payload;
  switch (event) {
    case IncomingEvents.nextInLine:
      console.log('next in line');
    case IncomingEvents.bookingInfo:
      console.log('booking info');
  
    default:
      console.log('unrecognized event');
      break;
  }
}