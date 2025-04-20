import 'dotenv/config';
import { publishPrices } from './handler.js';

const INTERVAL = process.env.PUBLISH_INTERVAL || 5000; // Mặc định 5 giây

console.log(`Gold Update Publisher started. Publishing every ${INTERVAL}ms...`);

setInterval(() => {
  publishPrices();
}, INTERVAL);
