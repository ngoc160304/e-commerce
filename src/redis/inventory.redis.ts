import { getRedis } from '~/configs/redis';
import { inventoryRepo } from '~/models/repositories/inventory.repo';
import { userDiscountRepo } from '~/models/repositories/userDiscount.repo';
const INVENTORY = 'inventory';
const setInventory = async (inventoryId: string, value: object, ttl: number) => {
  return await getRedis().set(`${INVENTORY}:${inventoryId}`, JSON.stringify(value), 'EX', ttl);
};
const getInventory = async (inventoryId: string) => {
  const data = await getRedis().get(`${INVENTORY}:${inventoryId}`);
  return data ? JSON.parse(data) : null;
};

const aquireLock = async (
  inventoryId: string,
  quantity: number,
  userDiscountId?: string
): Promise<boolean> => {
  const retry = 10;
  const exprire = 3;
  for (let i = 1; i <= retry; i++) {
    const lock = await getRedis().set(`${INVENTORY}:${inventoryId}:lock`, 10, 'EX', exprire, 'NX');
    if (lock === 'OK') {
      const updatedInventory = await inventoryRepo.reduceStock(inventoryId, quantity);
      if (!updatedInventory.modifiedCount) {
        await deleteKey(`${INVENTORY}:${inventoryId}:lock`);
        return false;
      }
      if (userDiscountId) {
        const updatedUserDiscount = await userDiscountRepo.reduceDiscount(userDiscountId);
        if (!updatedUserDiscount.modifiedCount) {
          await deleteKey(`${INVENTORY}:${inventoryId}:lock`);
          return false;
        }
      }
      return true;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  return false;
};
const deleteKey = async (inventoryKey: string) => {
  return await getRedis().del(`${INVENTORY}:${inventoryKey}`);
};
export const inventoryRedis = {
  setInventory,
  getInventory,
  aquireLock,
  deleteKey
};
