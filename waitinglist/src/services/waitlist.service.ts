import { insertWaitingListMember, WaitingListMember } from "../models/waitinglist";

const waitlistService = {
  async createEmptyWaitingList(eventId: number) {},

  async addUserToWaitlist(user: Partial<WaitingListMember>) {
    return await insertWaitingListMember(user);
  }
};

export default waitlistService;
