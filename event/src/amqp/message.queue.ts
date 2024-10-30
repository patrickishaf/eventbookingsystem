import amqp from 'amqplib/callback_api';
import config from '../config';
import { getConnection, getMessageChannel } from './connection';

export function initializeMessageQueue() {
  // startPublisher();
  startWorker();
}

// var pubChannel = null;
var offlinePubQueue = [];
// async function startPublisher() {
//   ((await getConnection()) as any).createConfirmChannel(function(err, ch) {
//       ch.on("error", function(err) {
//       console.error("[AMQP] channel error", err.message);
//     });
//     ch.on("close", function() {
//       console.log("[AMQP] channel closed");
//     });

//     pubChannel = ch;
//     while (true) {
//       var m = offlinePubQueue.shift();
//       if (!m) break;
//       publish(m[0], m[1], m[2]);
//     }
//   });
// }

async function publish(exchange, routingKey, content) {
  try {
    (await getMessageChannel()).publish(exchange, routingKey, content, { persistent: true }, async function(err, ok) {
      if (err) {
        console.error("[AMQP] publish", err);
        offlinePubQueue.push([exchange, routingKey, content] as never);
        (await getMessageChannel()).connection.close();
      }
    });
  } catch (e: any) {
    console.error("[AMQP] publish", e.message);
    offlinePubQueue.push([exchange, routingKey, content] as never);
  }
}
// A worker that acks messages only if processed succesfully
async function startWorker() {
  ((await getConnection()) as any).createChannel(function(err, ch) {
    ch.on("error", function(err) {
      console.error("[AMQP] channel error", err.message);
    });

    ch.on("close", function() {
      console.log("[AMQP] channel closed");
    });

    ch.prefetch(10);
    ch.assertQueue(config.eventQueue, { durable: true }, function(err, _ok) {
      ch.consume(config.eventQueue, (msg) => {
        if (msg.properties.correlationId) {
          console.log('RPC message received in event consumer');
          (ch as any).publish('', msg.properties.replyTo, Buffer.from('REPLY TO RPC MESSAGE'), { persistent: true }, async function(err, ok) {
            if (err) {
              console.error("[AMQP] publish", err);
              offlinePubQueue.push(['', msg.properties.replyTo, Buffer.from('REPLY TO FAILED RPC MESSAGE')] as never);
              (await getMessageChannel()).connection.close();
            }
          });
        } else {
          console.log('RECEIVED NORMAL MESSAGE IN EVENT QUEUE')
        }
        ch.ack(msg);
      }, { noAck: false });
      console.log("Worker is started");
    });
  });
}

// async function closeOnErr(err) {
//   if (!err) return false;
//   console.error("[AMQP] error", err);
//   ((await getConnection()) as any).close();
//   return true;
// }

// setInterval(function() {
//   publish("", "jobs", Buffer.from("work work work"));
// }, 1000);