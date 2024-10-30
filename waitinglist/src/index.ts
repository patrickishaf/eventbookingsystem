import express from 'express';
import config from './config';
import { listenToRpcQueue } from './amqp/rpc.queue';
import { initializeMessageQueue } from './amqp/message.queue';

async function main() {
  const app = express();

  await listenToRpcQueue();
  initializeMessageQueue();

  app.listen(config.port, () => {
    console.log('waiting list service listening on port', config.port);
  });
}

main()
