import waitlistService from "../services/waitlist.service";
import { IncomingEvents } from "./events";

export default async function handleQueueMessage(payload: any) {
  const { event, data } = payload;
  switch (event) {
    case IncomingEvents.addToWaitlist:
      return await waitlistService.addUserToWaitlist(data);
    case IncomingEvents.createWaitlist:
      return await waitlistService.createEmptyWaitingList(data.event_id);
    default:
      console.log('unrecognized event');
      break;
  }
}