import amqplib from 'amqplib';
import config from '../config';

let amqpConnection: any = null;
let rpcChannel: any = null;
let messageChannel: any = null;

export async function getConnection() {
  if (!amqpConnection) {
    amqpConnection = await amqplib.connect(config.messageBrokerUrl)
  }
  return amqpConnection as ReturnType<amqplib.connect>;
}

export async function getMessageChannel() {
  if (!messageChannel) {
    const connection = await getConnection();
    messageChannel = await connection.createChannel();
  }
  return messageChannel;
}

export async function getRpcChannel() {
  if (!rpcChannel) {
    const connection = await getConnection()
    rpcChannel = await connection.createChannel();
  }
  return rpcChannel;
}