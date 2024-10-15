const express = require('express');
const proxy = require('express-http-proxy');
const config = require('./config');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: true,
}));

app.use('/booking', proxy(config.bookingUrl));
app.use('/event', proxy(config.eventUrl));
app.use('/waitinglist', proxy(config.waitlistUrl));

app.listen(config.port, () => {
  console.log('gateway listening on port', config.port);
});
