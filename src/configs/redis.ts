import Redis from 'ioredis';
import env from './environments';
import { BAD_REQUEST } from '~/core/errors.response';
const redisClient = new Redis({
  port: env.REDIS_PORT,
  host: env.REDIS_URL,
  username: env.REDIS_NAME,
  password: env.REDIS_PASSWORD
});
let redisInstance: null | Redis = null;

export const connectRedis = async () => {
  try {
    redisClient.on('connect', () => {
      // eslint-disable-next-line no-console
      console.log('Connected to Redis!');
    });
    redisInstance = redisClient;
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
};

export const getRedis = () => {
  if (!redisInstance) {
    throw new BAD_REQUEST('Redis dose not connect !');
  }
  return redisInstance;
};
