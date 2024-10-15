import express from 'express';
import config from './config';
import { listenForRpcs } from './amqp/rpc';

async function main() {
  const app = express();
  await listenForRpcs();

  app.listen(config.port, () => {
    console.log('waiting list service listening on port', config.port);
  });
}

main()