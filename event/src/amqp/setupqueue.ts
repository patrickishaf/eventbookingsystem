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

// function publish(exchange, routingKey, content) {
//   try {
//     (pubChannel as any).publish(exchange, routingKey, content, { persistent: true }, function(err, ok) {
//       if (err) {
//         console.error("[AMQP] publish", err);
//         offlinePubQueue.push([exchange, routingKey, content] as never);
//         (pubChannel as any).connection.close();
//       }
//     });
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
//     ch.assertQueue(config.eventQueue, { durable: true }, function(err, _ok) {
//       if (closeOnErr(err)) return;
//       ch.consume(config.eventQueue, (msg) => {
//         if (msg.properties.correlationId) {
//           console.log('RPC message received in event consumer');
//           (ch as any).publish('', msg.properties.replyTo, Buffer.from('REPLY TO RPC MESSAGE'), { persistent: true }, function(err, ok) {
//             if (err) {
//               console.error("[AMQP] publish", err);
//               offlinePubQueue.push(['', msg.properties.replyTo, Buffer.from('REPLY TO FAILED RPC MESSAGE')] as never);
//               (pubChannel as any).connection.close();
//             }
//           });
//         } else {
//           console.log('RECEIVED NORMAL MESSAGE IN EVENT QUEUE')
//         }
//         ch.ack(msg);
//       }, { noAck: false });
//       console.log("Worker is started");
//     });
//   });
// }

// function closeOnErr(err) {
//   if (!err) return false;
//   console.error("[AMQP] error", err);
//   (amqpConn as any).close();
//   return true;
// }

// // setInterval(function() {
// //   publish("", "jobs", Buffer.from("work work work"));
// // }, 1000);