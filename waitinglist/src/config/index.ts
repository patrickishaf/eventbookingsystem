import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT,
  bookingQueue: process.env.BOOKING_QUEUE,
  eventQueue: process.env.EVENT_QUEUE,
  waitlistQueue: process.env.WAITLIST_QUEUE,
  messageBrokerUrl: process.env.MESSAGE_BROKER_URL,
  dbName: process.env.DB_NAME,
};

console.log('waiting list service config =>', config);

export default config;
