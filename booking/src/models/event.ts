export interface Event {
  id: number;
  name: string;
  description: string;
  total_tickets: number;
  remaining_tickets: number;
  created_at: Date;
}