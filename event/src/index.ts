import express from 'express';
import config from './config';
import registerHandlers from './api/registerhandlers';
import { listenToRpcQueue } from './amqp/rpc.queue';
import { initializeMessageQueue } from './amqp/message.queue';

async function main() {
  const app = express();

  await listenToRpcQueue();
  initializeMessageQueue();

  registerHandlers(app);

  app.listen(config.port, () => {
    console.log('event service listening on port', config.port);
  });
}

main();