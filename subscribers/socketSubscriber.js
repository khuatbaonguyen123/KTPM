import { socketSubscriber } from '../config/redis.js';
import { getIO } from '../config/socket.js';

export const setupSocketSubscriber = async () => {
  try {
    await socketSubscriber.subscribe('gold-price', (message) => {
      try {
        const goldData = JSON.parse(message); // { name, price }
        const io = getIO();
        io.emit('gold-price-changed', goldData);
        console.log('Gold price emitted to clients:', goldData);
      } catch (err) {
        console.error('Socket Subscriber - Error handling gold-price message:', err);
      }
    });

    console.log('Socket subscriber is listening to Redis channel: gold-price');
  } catch (err) {
    console.error('Socket Subscriber - Failed to subscribe to Redis channel:', err);
  }
};