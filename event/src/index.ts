import express from 'express';
import config from './config';
import registerHandlers from './api/registerhandlers';
import { listenToRpcQueue } from './amqp/rpc.queue';
import { listenToMessageQueue } from './amqp/message.queue';

async function main() {
  const app = express();

  await listenToRpcQueue();
  await listenToMessageQueue();

  registerHandlers(app);

  app.listen(config.port, () => {
    console.log('event service listening on port', config.port);
  });
}

main();