import express from 'express';
import config from './config';
import { listenToQueue } from './amqp/queue';

async function main() {
  const app = express();
  await listenToQueue();

  app.listen(config.port, () => {
    console.log('waiting list service listening on port', config.port);
  });
}

main()