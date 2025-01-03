import config from '../config';
import { v4 as uuid } from 'uuid';
import handleQueueMessage from './queuemsghandler';
import { getRpcChannel } from './connection';

export async function listenToRpcQueue() {
  const channel = await getRpcChannel();
  await channel.assertQueue(config.eventRpcQueue, { durable: true });
  channel.prefetch(1);
  channel.consume(config.eventRpcQueue, async (msg) => {
    if (msg.content) {
      const data = JSON.parse(msg.content.toString());
      console.log('event RPC queue received a message', data);
      
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
  });
}

export async function sendRpc(queueName: string, requestPayload: any) {
  const channel = await getRpcChannel();
  const q = await channel.assertQueue(queueName, { durable: true });
  const correlationId = uuid();

  return new Promise((resolve, reject) => {
    channel.consume(q.queue, (msg) => {
      if (msg.properties.correlationId === correlationId) {
        resolve(JSON.parse(msg.content.toString()));
        channel.ack(msg)
      }
    });

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(requestPayload)), {
      replyTo: q.queue,
      correlationId: correlationId,
    })
  })
}

// export async function publishMessage(queueName: string, requestPayload: any) {
//   const channel = await getRpcChannel();
//   await channel.assertQueue(queueName, { durable: true });
//   channel.sendToQueue(queueName, Buffer.from(JSON.stringify(requestPayload)));
// }