import express from 'express';
import config from './config';
import { listenToRpcQueue } from './amqp/rpc.queue';
import { listenToMessageQueue } from './amqp/message.queue';

async function main() {
  const app = express();

  await listenToRpcQueue();
  await listenToMessageQueue();

  app.listen(config.port, () => {
    console.log('waiting list service listening on port', config.port);
  });
}

main()
