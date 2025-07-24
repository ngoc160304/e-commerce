import ms from 'ms';
import { BAD_REQUEST, NOT_FOUND } from '~/core/errors.response';
import { inventoryRepo } from '~/models/repositories/inventory.repo';
import { inventoryRedis } from '~/redis/inventory.redis';

class InventoryService {
  static checkQtyInventory = async (inventoryId: string, quantity: number) => {
    const getInventory = await this.getInventoryDetail(inventoryId);
    if (quantity > getInventory.stock) {
      throw new BAD_REQUEST('Quantity exceeds available stock !');
    }
    return getInventory;
  };
  static getInventoryDetail = async (inventoryId: string) => {
    let inventoryCache = await inventoryRedis.getInventory(inventoryId);
    if (!inventoryCache) {
      const [getInventory] = await inventoryRepo.getDetails(inventoryId);
      if (!getInventory) {
        throw new NOT_FOUND('Product is not valid !');
      }
      await inventoryRedis.setInventory(inventoryId, getInventory, ms('60s') / 1000);
      inventoryCache = getInventory;
    }
    return inventoryCache;
  };
}
export default InventoryService;
