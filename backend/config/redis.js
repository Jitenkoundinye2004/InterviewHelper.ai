import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  reconnectOnError: (err) => {
    console.warn('Redis reconnect on error:', err.message);
    return err.message.includes('READONLY');
  },
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => {
  if (!err.message.includes('ECONNREFUSED')) {
    console.error('Redis error:', err);
  }
});
redis.on('ready', () => console.log('Redis ready'));

export default redis;
