/**
 * {
 *    cart:{userId}: {
 *      inventory:{inventoryId}: quantity
 *    }
 * }
 */
/**
 * {
 *    rfToken:{userid} : token
 * }
 */
import { getRedis } from '~/configs/redis';
import { BAD_REQUEST } from '~/core/errors.response';
const hashSet = async (key: string, value: Record<string, number>) => {
  const cache = await getRedis().hset(key, value);
  if (!cache) throw new BAD_REQUEST("Cann't set data to redis !");
  return cache;
};
const hashGetAll = async (key: string) => {
  return await getRedis().hgetall(key);
};

const set = async (key: string, value: string, ttl?: number) => {
  if (ttl) {
    const cache = await getRedis().set(key, value, 'EX', ttl);
    if (!cache) throw new BAD_REQUEST("Cann't set data to redis !");
    return cache;
  }
  const cache = await getRedis().set(key, value);
  if (!cache) throw new BAD_REQUEST("Cann't set data to redis !");
  return cache;
};
const get = async (key: string) => {
  return await getRedis().get(key);
};
const del = async (key: string) => {
  return await getRedis().del(key);
};
export const redisService = {
  hashSet,
  hashGetAll,
  set,
  get,
  del
};
