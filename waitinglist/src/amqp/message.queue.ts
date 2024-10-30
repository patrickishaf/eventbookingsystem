import config from '../config';
import { v4 as uuid } from 'uuid';
import handleQueueMessage from './queuemsghandler';
import { getMessageChannel } from './connection';

export async function listenToMessageQueue() {
  const channel = await getMessageChannel();
  await channel.assertQueue(config.waitlistQueue, { durable: true });
  channel.prefetch(1);
  channel.consume(config.waitlistQueue, async (msg) => {
    if (msg.content) {
      const data = JSON.parse(msg.content.toString());
      console.log('waitlist message queue received a message', data);
      
      const result = await handleQueueMessage(data);
      console.log('RESULT FROM PROCESSSING NORMAL MESSAGE:', result);
    }
    channel.ack(msg);
  });
}

export async function sendRpc(queueName: string, requestPayload: any) {
  const channel = await getMessageChannel();
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

export async function publishMessage(queueName: string, requestPayload: any) {
  const channel = await getMessageChannel();
  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(requestPayload)));
}