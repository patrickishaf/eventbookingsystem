import { Event, findEventById, insertEvent, updateEvent } from "../models/event";

const eventService = {
  async createNewEvent(event: Partial<Event>) {
    try {
      const newEventId = await insertEvent(event);
      return await findEventById(newEventId);
    } catch (err: any) {
      console.log('failed to create event in eventService. error:', err.message);
    }
  },
  
  async getEventInfo(eventId: number) {
    try {
      const event = await findEventById(eventId);
      return event;
    } catch (err: any) {
      console.log('failed to get event info in eventService. error:', err.message)
    }
  },

  async decrementEventTickets(event_id: number) {
    try {
      const event = await findEventById(event_id);
      console.log({ event });
      await updateEvent(event_id, { remaining_tickets: event.remaining_tickets - 1 });
      console.log('decremented event tickets');
      return { ...event, remaining_tickets: event.remaining_tickets - 1 };
    } catch (err: any) {
      console.log('failed to decrement tickets in eventService. error:', err.message);
    }
  }
}

export default eventService;
