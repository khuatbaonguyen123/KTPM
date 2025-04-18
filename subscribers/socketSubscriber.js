import { subscriber } from '../config/redis.js';
import { getIO } from '../config/socket.js';

export const setupSocketSubscriber = async () => {
  try {
    await subscriber.subscribe('gold-price', async (message) => {
      try {
        const goldData = JSON.parse(message); // { name, price }

        // Gọi API nội bộ để lưu dữ liệu vào DB
        const response = await fetch('http://localhost:8080/gold', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(goldData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const savedData = await response.json();

        // Emit tới các client sau khi lưu thành công
        const io = getIO();
        io.emit('gold-price-changed', savedData);
        console.log('Gold price emitted to clients:', savedData);

      } catch (err) {
        console.error('Error handling gold-price message:', err);
      }
    });

    console.log('Socket subscriber is listening to Redis channel: gold-price');
  } catch (err) {
    console.error('Failed to subscribe to Redis channel:', err);
  }
};
