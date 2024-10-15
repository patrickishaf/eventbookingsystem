import amqplib from 'amqplib';
import { v4 as uuid } from 'uuid';
import config from '../config';
import handleQueueMessage from './queuemsghandler';

let amqpConnection = null;

async function getChannel() {
  if (!amqpConnection) {
    amqpConnection = await amqplib.connect(config.messageBrokerUrl);
  }
  return await (amqpConnection! as ReturnType<amqplib.connect>).createChannel()
}

export async function listenToQueue() {
  const channel = await getChannel();
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
  const channel = await getChannel();
  const q = await channel.assertQueue(queueName);
  const correlationId = uuid();
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(requestPayload)), {
    replyTo: q.queue,
    correlationId: correlationId,
  })

  return new Promise((resolve, reject) => {
    channel.consume(q.queue, (msg) => {
      channel.ack(msg)
      if (msg.properties.correlationId === correlationId) {
        resolve(JSON.parse(msg.content.toString()));
      } else {
        reject('data not found');
      }
    })
  })
}

export async function publishMessage(queueName: string, requestPayload: any) {
  const channel = await getChannel();
  await channel.assertQueue(queueName);
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(requestPayload)));
}