import db from "../db";

export interface WaitingListMember {
  id: number;
  event_id: number;
  user_email: string;
  first_name?: string;
  last_name?: string;
  created_at: Date;
}

const _tableName = 'waiting_list';

export async function insertWaitingListMember(item: Partial<WaitingListMember>) {
  const query = db(_tableName).insert(item);
  const [id] = await query;
  return id;
}

export async function findWaitingListByEventId(id: number) {
  const query = db(_tableName).select('*').where('event_id', id);
  const waitingList = await query as WaitingListMember[];
  return waitingList;
}

export async function findFirstWaitingListMember(eventId: number) {
  const query = db(_tableName).select('*').where('event_id', eventId).orderBy('created_at', 'asc').first();
  const firstMember = (await query) as WaitingListMember;
  return firstMember;
}

export async function deleteWaitingListMember(options: Partial<WaitingListMember>) {
  if (Object.keys(options).length <= 0) return false;
  const query = db(_tableName).delete().where(options)
  await query;
  return true;
}