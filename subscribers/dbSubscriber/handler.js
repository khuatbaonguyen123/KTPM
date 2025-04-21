import { dbSubscriber } from "../../config/redis.js";
import { fetchWithRetry } from "../../utils/retryHelper.js";
import { deadLetterClient } from "../../config/redis.js";
import 'dotenv/config';

// In-memory message queue
const queue = [];
let isProcessing = false;

const MAX_RETRIES = 3;
const MAX_LIFETIME = 60 * 1000; // 60s

// Hàm gọi API lưu vào DB
const postData = async (goldData) => {
  const response = await fetch("http://localhost:3000/gold", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(goldData),
  });

  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return await response.json();
};

// Hàm xử lý tuần tự từng message trong queue
const processQueue = async () => {
  if (isProcessing || queue.length === 0) return;

  isProcessing = true;

  const goldData = queue.shift();
  const { retryCount, createdAt } = goldData;

  // Put into dead letter queue if exceed max retries count
  if (retryCount >= MAX_RETRIES || Date.now() - createdAt > MAX_LIFETIME) {
    console.warn("Pushing to dead letter queue:", goldData);
  
    await deadLetterClient.rPush("dead_letter_queue", JSON.stringify(goldData));
    
    isProcessing = false;
    setImmediate(processQueue);
    return;
  }

  try {
    const savedData = await fetchWithRetry(() => postData(goldData), {
      retries: 2, // mỗi lần re-queue thì sẽ thử thêm 2 lần nữa
    });
    console.log("Saved gold data to DB (with retry):", savedData);
  } catch (err) {
    console.warn(`Requeuing due to error: ${err.message}`);
    queue.push({
      ...goldData,
      retryCount: retryCount + 1,
    });
  }

  isProcessing = false;
  setImmediate(processQueue);
};

// Lắng nghe Redis và đẩy vào queue
export const setupDbSubscriber = async () => {
  try {
    await dbSubscriber.subscribe("gold-price", async (message) => {
      const goldData = JSON.parse(message); // { name, price }

      queue.push({
        ...goldData,
        retryCount: 0,
        createdAt: Date.now(),
      });

      processQueue();
    });

    console.log("DB subscriber is listening to Redis channel: gold-price");
  } catch (err) {
    console.error("Failed to subscribe to Redis channel:", err);
  }
};
