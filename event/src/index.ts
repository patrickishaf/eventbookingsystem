import express from 'express';
import config from './config';
import registerHandlers from './api/registerhandlers';

async function main() {
  const app = express();

  registerHandlers(app);

  app.listen(config.port, () => {
    console.log('event service listening on port', config.port);
  });
}

main();