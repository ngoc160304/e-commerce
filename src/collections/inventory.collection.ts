import mongodb from '~/configs/database';
import { inventoryModel } from '~/models/inventory.model';
const createCollectionInventory = async () => {
  try {
    await mongodb.getDB().createCollection(inventoryModel.INVENTORY_COLECTION_NAME);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    //
  } finally {
    await mongodb.getDB().command({
      collMod: inventoryModel.INVENTORY_COLECTION_NAME,
      validator: inventoryModel.INVENTORY_COLLECTION_SCHEMA
    });
  }
};
export { createCollectionInventory };
