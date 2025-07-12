import { ClientSession } from 'mongodb';
import { createObjectId } from '~/utils/format';
import { Inventory, inventoryModel } from '../inventory.model';
import { isArray } from 'lodash';

const createNew = async (data: Inventory | Inventory[], session?: ClientSession) => {
  if (isArray(data))
    return await inventoryModel.getCollectionInventory().insertMany(data, { session });
  return await inventoryModel.getCollectionInventory().insertOne(data, { session });
};
const deleteMultiByProductId = async (productId: string) => {
  return await inventoryModel.getCollectionInventory().deleteMany({
    productId: createObjectId(productId)
  });
};
const deleteByProductId = async (productId: string) => {
  return await inventoryModel.getCollectionInventory().deleteMany({
    productId: createObjectId(productId)
  });
};
export const inventoryRepo = {
  createNew,
  deleteMultiByProductId,
  deleteByProductId
};
