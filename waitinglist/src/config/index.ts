import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT,
  bookingQueue: process.env.BOOKING_QUEUE,
  bookingRpcQueue: process.env.BOOKING_RPC_QUEUE,
  eventQueue: process.env.EVENT_QUEUE,
  eventRpcQueue: process.env.EVENT_RPC_QUEUE,
  waitlistQueue: process.env.WAITLIST_QUEUE,
  waitlistRpcQueue: process.env.WAITLIST_RPC_QUEUE,
  messageBrokerUrl: process.env.MESSAGE_BROKER_URL,
  dbName: process.env.DB_NAME,
};

console.log({ wailistConfig: config });

export default config;
