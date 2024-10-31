import { findBookingsByEventId } from "../models/booking";
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
      return 'unrecognized event';
  }
}

async function handleNextInLineEvent(data: any) {
  return undefined;
}

async function handleBookingInfoEvent(data: any) {
  try {
    const { event_id } = data;
    const bookings = await findBookingsByEventId(event_id);
    if (!bookings) {
      return false;
    }
    return bookings;
  } catch (err: any) {
    console.error('failed to get booking info for event');
    return false;
  }
}