import { ClientSession } from 'mongodb';
import { createObjectId } from '~/utils/format';
import { Inventory, inventoryModel } from '../inventory.model';
import { isArray } from 'lodash';
import { productModel } from '../product.model';
const { getCollectionInventory } = inventoryModel;
const findOneById = async (id: string, filter = {}) => {
  return await getCollectionInventory().findOne({
    _id: createObjectId(id),
    ...filter
  });
};

const createNew = async (data: Inventory | Inventory[], session?: ClientSession) => {
  if (isArray(data)) return await getCollectionInventory().insertMany(data, { session });
  return await getCollectionInventory().insertOne(data, { session });
};
const deleteMultiByProductId = async (productId: string) => {
  return await getCollectionInventory().deleteMany({
    productId: createObjectId(productId)
  });
};
const getDetails = async (id: string) => {
  return await getCollectionInventory()
    .aggregate([
      {
        $match: {
          _id: createObjectId(id)
        }
      },
      {
        $lookup: {
          from: productModel.PRODUCT_COLECTION_NAME,
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      }
    ])
    .toArray();
};
const reduceStock = async (inventoryId: string, quantity: number) => {
  return await getCollectionInventory().updateOne(
    {
      _id: createObjectId(inventoryId),
      stock: {
        $gte: quantity
      }
    },
    { $inc: { stock: -quantity } }
  );
};
export const inventoryRepo = {
  createNew,
  deleteMultiByProductId,
  findOneById,
  getDetails,
  reduceStock
};
