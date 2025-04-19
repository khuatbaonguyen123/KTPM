// config/redis.js
import { createClient } from 'redis';
import 'dotenv/config';

const createRedisClient = (label) => {
  const client = createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }
  });

  client.on('error', (err) => {
    console.error(`[Redis:${label}] Connection error:`, err);
  });

  return client;
};

const publisher = createRedisClient('publisher');
const dbSubscriber = createRedisClient('dbSubscriber');
const socketSubscriber = createRedisClient('socketSubscriber');

await publisher.connect();
await dbSubscriber.connect();
await socketSubscriber.connect();

export { publisher, dbSubscriber, socketSubscriber };
