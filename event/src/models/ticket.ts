import db from "../db";

export interface Ticket {
  id: number;
  event_id: number;
  tier?: string;
  total: number;
  remaining: number;
  created_at: Date;
  updated_at?: Date;
}

const _tableName = 'tickets'

export async function insertTickets(data: Partial<Ticket>) {
  const query = db(_tableName).insert(data).returning('*');
  const ticket = await query;
  return ticket;
}

export async function findTicketsByEventId(eventId: number) {
  const query = db(_tableName).select('*').where('event_id', eventId).first()
  const ticket = (await query) as Ticket;
  return ticket;
}

export async function updateTicketByEventId(data: Partial<Ticket>, eventId: number) {
  const query = db(_tableName).where('event_id', eventId).update(data).returning('*');
  const [ticket] = await query;
  return ticket as Ticket;
}
