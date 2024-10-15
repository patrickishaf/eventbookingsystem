import express from 'express';
import config from './config';
import registerHandlers from './api/registerhandlers';
import { listenToQueue } from './amqp/queue';

async function main() {
  const app = express();
  
  await listenToQueue();
  registerHandlers(app);

  app.listen(config.port, () => {
    console.log('event service listening on port', config.port);
  });
}

main();