import db from '../db';

export interface Event {
  id: number;
  name: string;
  description: string;
  total_tickets: number;
  remaining_tickets: number;
  created_at: Date;
}

const _tableName = 'events';

export async function insertEvent(event: Partial<Event>) {
  const query = db(_tableName).insert(event);
  const [id] = await query;
  return id;
}

export async function findEventById(id: number) {
  const query = db(_tableName).select('*').where({ id }).first();
  const event = (await query) as Event;
  return event;
}