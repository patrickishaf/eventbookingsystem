import { Event, findEventById, insertEvent } from "../models/event";

const eventService = {
  async createNewEvent(event: Partial<Event>) {
    const newEventId = await insertEvent(event);
    return await findEventById(newEventId);
  },
  
  async getEventInfo(eventId: number) {
    const event = await findEventById(eventId);
    return event;
  },
}

export default eventService;
