import db from '../db';

export interface Booking {
  id: number;
  event_id: number;
  user_email: number;
  first_name?: string;
  last_name?: string;
  created_at: Date;
}

const _tableName = 'bookings';

export async function insertBooking(data: Partial<Booking>) {
  const query = db(_tableName).insert(data);
  const [booking] = await query;
  return booking;
}

export async function findBookingById(id: number) {
  const query = db(_tableName).select('*').where('id', id).first();
  const booking = (await query) as Booking;
  return booking;
}

export async function findBookingsByEventId(id: number) {
  const query = db(_tableName).select('*').where('event_id', id);
  const bookings = (await query) as Booking[];
  return bookings;
}

export async function deleteBooking(id: number) {
  const query = db(_tableName).delete().where('id', id);
  const result = await query;
  return result;
}