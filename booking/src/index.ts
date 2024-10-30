import express from 'express';
import config from './config';
import { listenToRpcQueue } from './amqp/rpc.queue';
import { initializeMessageQueue } from './amqp/message.queue';
import registerHandlers from './api/registerhandlers';

async function main() {
  const app = express();

  await listenToRpcQueue();
  initializeMessageQueue();
  registerHandlers(app);

  app.listen(config.port, () => {
    console.log('booking service listening on port', config.port);
  });
}

main();