import { deadLetterClient } from "../config/redis.js";

const API_ENDPOINT = "http://localhost:3000/gold";
const DEAD_LETTER_QUEUE = "dead_letter_queue";

// Hàm kiểm tra trạng thái server
const checkServerHealth = async () => {
  try {
    const res = await fetch("http://localhost:3000/health");
    return res.ok;  // Trả về true nếu server khỏe
  } catch (err) {
    console.warn("[DeadLetter] Server is down: ", err.message);
    return false;  // Trả về false nếu không thể kết nối
  }
};

// Hàm retry các message từ Dead Letter Queue
const retryDeadLetter = async () => {
  const healthy = await checkServerHealth();
  if (!healthy) {
    console.warn("[DeadLetter] Server down. Skipping retry...");
    return;
  }

  const length = await deadLetterClient.lLen(DEAD_LETTER_QUEUE);
  for (let i = 0; i < length; i++) {
    const message = await deadLetterClient.lPop(DEAD_LETTER_QUEUE);
    if (!message) continue;

    const goldData = JSON.parse(message);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goldData),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      console.log("[DeadLetter] Retried successfully:", goldData);
    } catch (err) {
      console.warn("[DeadLetter] Retry failed. Requeuing...", err.message);
      await deadLetterClient.rPush(DEAD_LETTER_QUEUE, message);  // Re-add to dead letter queue
    }
  }
};

// Hàm bắt đầu vòng lặp retry
export const startRetryLoop = () => {
  const loop = async () => {
    await retryDeadLetter();
    const interval = 1 * 60 * 1000;
    setTimeout(loop, interval);
  };

  loop();
};

export const inspectDeadLetterQueue = async () => {
    try {
      const messages = await deadLetterClient.lRange(DEAD_LETTER_QUEUE, 0, -1);
      if (messages.length === 0) {
        console.log("Dead letter queue is currently empty.");
      } else {
        console.log(`Dead letter queue has ${messages.length} message(s):`);
        messages.forEach((msg, index) => {
          console.log(`[${index + 1}]`, JSON.parse(msg));
        });
      }
    } catch (err) {
      console.error("Failed to inspect dead letter queue:", err);
    }
  };
