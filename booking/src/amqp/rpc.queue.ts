import { v4 as uuid } from 'uuid';
import config from '../config';
import handleQueueMessage from './queuemsghandler';
import { getRpcChannel } from './connection';

export async function listenToRpcQueue() {
  const channel = await getRpcChannel();
  await channel.assertQueue(config.bookingQueue, { durable: true });
  channel.prefetch(1);
  channel.consume(config.bookingQueue, async (msg) => {
    if (msg.content) {
      const data = JSON.parse(msg.content.toString());

      if (msg.properties.correlationId) {
        console.log('processing rpc', data);
        const result = await handleQueueMessage(data);
        channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(result)), {
          correlationId: msg.properties.correlationId,
        })
      } else {
        console.log('processing regular msg');
        handleQueueMessage(data);
      }
    }
    channel.ack(msg);
  })
}

export async function sendRpc(queueName: string, requestPayload: any) {
  const channel = await getRpcChannel();
  const q = await channel.assertQueue(queueName, { durable: true });
  const correlationId = uuid();
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(requestPayload)), {
    replyTo: q.queue,
    correlationId: correlationId,
  })

  return new Promise((resolve, reject) => {
    channel.consume(q.queue, (msg) => {
      if (msg.properties.correlationId === correlationId) {
        channel.ack(msg);
        resolve(JSON.parse(msg.content.toString()));
      } else {
        channel.ack(msg);
        reject('data not found');
      }
    })
  })
}

export async function publishMessage(queueName: string, payload: any) {
  try {
    const channel = await getRpcChannel();
    const q = await channel.assertQueue(queueName, { durable: true });
    const result = await channel.sendToQueue(q.queue, Buffer.from(JSON.stringify(payload)), { persistent: true });
    console.log('message sent to queue', {queueName, payload, result});
  } catch (err: any) {
    console.log('failed to publish message')
  }
}

// export async function publishMsg(queueName: string, bindingKey: string, message: any) {
//   try {
//     const channel = await getChannel();
//     const q = await channel.assertQueue(queueName, { durable: true });
//     await channel.publish(config.SYSTEM_IDENTIFIER!, bindingKey, Buffer.from(message));
//     console.log(message, 'published to channel with binding key', bindingKey);
//   } catch(err: any) {
//     console.error(`failed to publish to message broker channel ${err.message}`)
//     throw new Error(`failed to publish to message broker channel ${err.message}`);
//   }
// }