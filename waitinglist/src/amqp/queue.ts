import amqplib from 'amqplib';
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
  await channel.assertQueue(config.waitlistQueue, { durable: true });
  channel.prefetch(1);
  channel.consume(config.waitlistQueue, async (msg) => {
    if (msg.content) {
      const data = JSON.parse(msg.content.toString());

      if (msg.properties.correlationId) {
        const result = await handleQueueMessage(data);
        console.log('processing rpc', data);
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

export async function sendRpc(queueName: string, requestPayload: any, correlationId: string) {
  const channel = await getChannel();
  const q = await channel.assertQueue(queueName);
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