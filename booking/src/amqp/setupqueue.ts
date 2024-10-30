// import amqp from 'amqplib/callback_api';
// import config from '../config';

// // if the connection is closed or fails to be established at all, we will reconnect
// var amqpConn = null;
// export default function startAMQP() {
//   amqp.connect(config.messageBrokerUrl + "?heartbeat=60", function(err, conn) {
//     if (err) {
//       console.error("[AMQP]", err.message);
//       return setTimeout(startAMQP, 1000);
//     }
//     conn.on("error", function(err) {
//       if (err.message !== "Connection closing") {
//         console.error("[AMQP] conn error", err.message);
//       }
//     });
//     conn.on("close", function() {
//       console.error("[AMQP] reconnecting");
//       return setTimeout(startAMQP, 1000);
//     });
//     console.log("[AMQP] connected");
//     amqpConn = conn;
//     whenConnected();
//   });
// }

// function whenConnected() {
//   startPublisher();
//   startWorker();
// }

// var pubChannel = null;
// var offlinePubQueue = [];
// function startPublisher() {
//   (amqpConn as any).createConfirmChannel(function(err, ch) {
//     if (closeOnErr(err)) return;
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

// export function publish(exchange, routingKey, content) {
//   try {
//     (pubChannel as any).publish(exchange, routingKey, content, { persistent: true, correlationId: 'teruei' }, (err, ok) => {
//       if (err) {
//         console.error("[AMQP] publish", err);
//         offlinePubQueue.push([exchange, routingKey, content] as never);
//         (pubChannel as any).connection.close();
//       } else if(ok) {
//         console.log('received rpc reponse from sender =>', ok.content.toString());
//       } else {
//         console.log('pushed message to the event queue', content.toString());
//       }
//     })
//   } catch (e: any) {
//     console.error("[AMQP] publish", e.message);
//     offlinePubQueue.push([exchange, routingKey, content] as never);
//   }
// }
// // A worker that acks messages only if processed succesfully
// function startWorker() {
//   (amqpConn as any).createChannel(function(err, ch) {
//     if (closeOnErr(err)) return;
//     ch.on("error", function(err) {
//       console.error("[AMQP] channel error", err.message);
//     });

//     ch.on("close", function() {
//       console.log("[AMQP] channel closed");
//     });

//     ch.prefetch(10);
//     ch.assertQueue("jobs", { durable: true }, function(err, _ok) {
//       if (closeOnErr(err)) return;
//       ch.consume("jobs", processMsg, { noAck: false });
//       console.log("Worker is started");
//     });

//     function processMsg(msg) {
//       work(msg, function(ok) {
//         try {
//           if (ok)
//             ch.ack(msg);
//           else
//             ch.reject(msg, true);
//         } catch (e) {
//           closeOnErr(e);
//         }
//       });
//     }
//   });
// }

// function work(msg, cb) {
//   console.log("Got msg in the booking queue", msg.content.toString());
//   cb(true);
// }

// function closeOnErr(err) {
//   if (!err) return false;
//   console.error("[AMQP] error", err);
//   (amqpConn as any).close();
//   return true;
// }

// setInterval(function() {
//   publish("", config.eventQueue, Buffer.from(JSON.stringify({ event: 'event', data: 'data' })));
// }, 1000);