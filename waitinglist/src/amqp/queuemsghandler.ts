import waitlistService from "../services/waitlist.service";
import { IncomingEvents } from "./events";

export default async function handleQueueMessage(payload: any) {
  console.log({payload});
  const { event, data } = payload;
  switch (event) {
    case IncomingEvents.addToWaitlist:
      return await waitlistService.addUserToWaitlist(data);
    case IncomingEvents.createWaitlist:
      return await waitlistService.createEmptyWaitingList(1);
    default:
      console.log('unrecognized event');
      break;
  }
}

async function handleAddToWaitingList(data: any) {}

async function handleAddUser(data: any) {}

async function handleGetNextWaitingListMember(data: any) {}

async function handleDeleteNextInLine(data: any) {}

async function handleGetWaitingList(data: any) {}