// retryHelper.js
import retry from 'async-retry';

export async function fetchWithRetry(fn, options = {}) {
  return retry(
    async (bail, attempt) => {
      try {
        return await fn();
      } catch (error) {
        const status = error?.response?.status;

        // ❌ Dừng retry nếu là lỗi client-side không thể phục hồi
        if (status && status < 500 && status !== 429) {
          bail(error);
        }

        // ⏳ Xử lý riêng rate limit
        if (status === 429) {
          await handleRateLimitError(error, attempt);
          throw error; // tiếp tục retry
        }

        throw error; // các lỗi còn lại (5xx) => retry
      }
    },
    {
      retries: 3,
      minTimeout: 1000,
      maxTimeout: 5000,
      ...options,
    }
  );
}

async function handleRateLimitError(error, attempt) {
  const retryAfterHeader = error.response?.headers['retry-after'];
  const waitTime = retryAfterHeader
    ? parseFloat(retryAfterHeader) * 1000 // "Retry-After" thường là giây
    : 30 * 1000; // fallback 30s nếu header không có

  console.warn(`[Retry ${attempt}] Rate limited. Waiting ${waitTime}ms before retrying...`);
  await new Promise(resolve => setTimeout(resolve, waitTime));
}
