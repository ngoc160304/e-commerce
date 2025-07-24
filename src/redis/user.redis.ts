import { getRedis } from '~/configs/redis';
const rfToken = 'rfToken';
const setRfToken = async (
  userId: string,
  token: { refreshToken: string; publicKey: string },
  ttl: number
) => {
  return await getRedis().set(`${rfToken}:${userId}`, JSON.stringify(token), 'EX', ttl);
};
const getKeyStore = async (userId: string) => {
  const keyStore = await getRedis().get(`${rfToken}:${userId}`);
  if (keyStore) {
    return JSON.parse(keyStore);
  }
  return null;
};
const delKeyStore = async (userId: string) => {
  return await getRedis().del(`${rfToken}:${userId}`);
};
export const userRedis = {
  setRfToken,
  getKeyStore,
  delKeyStore
};
