import { deleteWaitingListMember, findFirstWaitingListMember, findWaitingListByEventId } from "../models/waitinglist";
import waitlistService from "../services/waitlist.service";
import { IncomingEvents } from "./events";

export default async function handleQueueMessage(payload: any) {
  const { event, data } = payload;
  switch (event) {
    case IncomingEvents.addToWaitlist:
      return await waitlistService.addUserToWaitlist(data);
    case IncomingEvents.createWaitlist:
      return await waitlistService.createEmptyWaitingList(1);
    case IncomingEvents.deleteNextInLine:
      return await handleDeleteNextInLine(data);
    case IncomingEvents.getWaitlist:
      return await handleGetWaitingList(data);
    case IncomingEvents.nextWaitlistMember:
      return await handleGetNextWaitingListMember(data);
    default:
      console.log('unrecognized event');
      break;
  }
}

async function handleAddToWaitingList(data: any) {}

async function handleAddUser(data: any) {}

async function handleGetNextWaitingListMember(data: any) {
  try {
    const nextInLine = await findFirstWaitingListMember(data.event_id);
    if (!nextInLine) {
      return false
    }
    return nextInLine;
  } catch (err: any) {
    console.log('failed to handle next waiting list member. error:', err.message);
    return false;
  }
}

async function handleDeleteNextInLine(data: any) {
  try {
    const { event_id, user_email } = data;
    const result = await deleteWaitingListMember({ event_id, user_email });
    return result;
  } catch (err: any) {
    console.log('failed to delete member from waiting list. error:', err.message);
    return false;
  }
}

async function handleGetWaitingList(data: any) {
  try {
    const { event_id } = data;
    const waitingList = await findWaitingListByEventId(event_id);
    if (!waitingList) {
      return false;
    }
    return waitingList;
  } catch (err: any) {
    console.error('failed to get waiting list');
    return false;
  }
}