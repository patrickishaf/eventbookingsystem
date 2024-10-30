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
//     ch.on("error", function(err) {
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
//       console.log('PUBLISH')
//     }
//   });
// }

export async function publish(exchange, routingKey, content) {
  try {
    (await getMessageChannel()).publish(exchange, routingKey, content, { persistent: true, correlationId: 'teruei' }, async (err, ok) => {
      if (err) {
        console.error("[AMQP] publish", err);
        offlinePubQueue.push([exchange, routingKey, content] as never);
        (await getMessageChannel()).connection.close();
      } else if(ok) {
        console.log('received rpc reponse from sender =>', ok.content.toString());
      } else {
        console.log('pushed message to the event queue', content.toString());
      }
    })
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
    ch.assertQueue("jobs", { durable: true }, function(err, _ok) {
      ch.consume("jobs", processMsg, { noAck: false });
      console.log("Worker is started");
    });

    function processMsg(msg) {
      work(msg, function(ok) {
        try {
          if (ok)
            ch.ack(msg);
          else
            ch.reject(msg, true);
        } catch (e) {
          closeOnErr(e);
        }
      });
    }
  });
}

function work(msg, cb) {
  console.log("Got msg in the booking queue", msg.content.toString());
  cb(true);
}

async function closeOnErr(err) {
  if (!err) return false;
  console.error("[AMQP] error", err);
  ((await getConnection()) as any).close();
  return true;
}

// setInterval(function() {
//   console.log('PUBLISHING MSG FROM BOOKING QUEUE TO EVENT QUEUE')
//   publish("", config.eventQueue, Buffer.from(JSON.stringify({ event: 'event', data: 'data' })));
// }, 1000);