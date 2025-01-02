const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

class RateLimitMonitor {
  static async logRateLimitHit(key, route) {
    try {
      const now = Date.now();
      await redis.zadd('rate-limit-hits', now, `${key}:${route}:${now}`);
      
      // Keep only last 24 hours of data
      const dayAgo = now - (24 * 60 * 60 * 1000);
      await redis.zremrangebyscore('rate-limit-hits', '-inf', dayAgo);
    } catch (error) {
      console.error('Error logging rate limit hit:', error);
    }
  }

  static async getRateLimitHits(minutes = 60) {
    try {
      const now = Date.now();
      const since = now - (minutes * 60 * 1000);
      const hits = await redis.zrangebyscore('rate-limit-hits', since, now);
      
      // Group hits by route
      const routeHits = hits.reduce((acc, hit) => {
        const [key, route] = hit.split(':');
        acc[route] = (acc[route] || 0) + 1;
        return acc;
      }, {});

      return routeHits;
    } catch (error) {
      console.error('Error getting rate limit hits:', error);
      return {};
    }
  }
}

module.exports = RateLimitMonitor; 