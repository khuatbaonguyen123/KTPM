// redis.js
import { createClient } from 'redis';

const publisher = createClient();
const dbSubscriber = createClient();
const socketSubscriber = createClient();

await publisher.connect();
await dbSubscriber.connect();
await socketSubscriber.connect();

export { publisher, dbSubscriber, socketSubscriber };
