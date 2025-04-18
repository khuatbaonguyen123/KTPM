// dbSubscriber.js
import { dbSubscriber } from "../config/redis.js";

export const setupDbSubscriber = async () => {
  try {
    await dbSubscriber.subscribe('gold-price', async (message) => {
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
        console.log('Saved gold data to DB:', savedData);
      } catch (err) {
        console.error('DB Subscriber - Error handling gold-price message:', err);
      }
    });

    console.log('DB subscriber is listening to Redis channel: gold-price');
  } catch (err) {
    console.error('DB Subscriber - Failed to subscribe to Redis channel:', err);
  }
};
