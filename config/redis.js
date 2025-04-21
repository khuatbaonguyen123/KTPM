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
const rateLimiter = createRedisClient('rateLimiter');
const deadLetterClient = createRedisClient('deadLetter');

await publisher.connect();
await dbSubscriber.connect();
await socketSubscriber.connect();
await rateLimiter.connect(); 
await deadLetterClient.connect();

export { publisher, dbSubscriber, socketSubscriber, rateLimiter, deadLetterClient };
