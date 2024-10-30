export enum OutgoingEvents {
  eventInfo = 'event_info',
  addToWaitlist = 'add_to_waitlist',
  decrementTickets = 'decrement_tickets',
  deleteNextInLine = 'delete_next_in_line',
  nextWaitlistMember = 'next_waitlist_member',
}

export enum IncomingEvents {
  nextInLine = 'next_in_line',
  bookingInfo = 'booking_info',
}