const dotenv = require('dotenv')

dotenv.config();

const config = {
  port: process.env.PORT ?? 3000,
  bookingUrl: process.env.BOOKING_URL,
  eventUrl: process.env.EVENT_URL,
  waitlistUrl: process.env.WAITLIST_URL,
}

module.exports = config;
