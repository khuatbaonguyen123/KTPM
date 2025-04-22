// middleware/rateLimiter.js
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { rateLimiter as redisClient } from '../../config/redis.js';

const rateLimiterFlex = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rateLimiter',
  points: 10,
  duration: 30,
});

export const limiter = async (req, res, next) => {
  try {
    await rateLimiterFlex.consume(req.ip);
    next();
  } catch (rateLimiterRes) {
    const retrySecs = Math.ceil(rateLimiterRes.msBeforeNext / 1000) || 1;
    res.setHeader('Retry-After', retrySecs);
    res.status(429).json({
      message: `Too many requests. Try again in ${retrySecs} seconds.`,
    });
  }
};
