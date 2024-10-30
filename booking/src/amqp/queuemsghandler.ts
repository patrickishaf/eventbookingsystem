import { IncomingEvents } from "./events";

export default async function handleQueueMessage(payload: any) {
  const { event, data } = payload;
  switch (event) {
    case IncomingEvents.nextInLine:
      console.log('handling next in line event');
      return await handleNextInLineEvent(data);
    case IncomingEvents.bookingInfo:
      console.log('handling booking info event');
      return await handleBookingInfoEvent(data);
  
    default:
      console.log('unrecognized event');
      break;
  }
}

async function handleNextInLineEvent(data: any) {
  return undefined;
}

async function handleBookingInfoEvent(data: any) {
  return undefined;
}