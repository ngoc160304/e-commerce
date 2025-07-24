import { createObjectId } from '~/utils/format';
import { Product, productModel } from '../product.model';
import { ClientSession } from 'mongodb';
import { inventoryModel } from '../inventory.model';

const findOneById = async (id: string, filter = {}) => {
  return await productModel.getCollectionProduct().findOne({
    _id: createObjectId(id),
    _destroy: false,
    ...filter
  });
};
const createNew = async (data: Product, session?: ClientSession) => {
  return await productModel.getCollectionProduct().insertOne(data, { session });
};

const updateByShop = async (data: Partial<Product>, producId: string, shopId: string) => {
  return await productModel.getCollectionProduct().updateOne(
    {
      _id: createObjectId(producId),
      shopId: createObjectId(shopId),
      _destroy: false
    },
    {
      $set: data
    }
  );
};
const getListProductUser = async (
  find: object,
  sort: object,
  limitPage: number,
  pageCurrent: number
) => {
  return await productModel
    .getCollectionProduct()
    .aggregate([
      {
        $match: find
      },
      {
        $lookup: {
          from: inventoryModel.INVENTORY_COLECTION_NAME,
          localField: '_id',
          foreignField: 'product_id',
          as: 'iventory'
        }
      },
      {
        $project: {
          _id: 1,
          product_name: 1,
          description: 1,
          total_stock: { $sum: '$iventory.stock_quantity' }
        }
      },
      {
        $sort: sort
      },
      {
        $skip: pageCurrent
      },
      {
        $limit: limitPage
      }
    ])
    .toArray();
};
const deleteByShop = async (productId: string, shopId: string) => {
  return await productModel.getCollectionProduct().updateOne(
    {
      _id: createObjectId(productId),
      shopId: createObjectId(shopId)
    },
    {
      $set: {
        _destroy: true
      }
    }
  );
};
export const productRepo = {
  findOneById,
  createNew,
  updateByShop,
  getListProductUser,
  deleteByShop
};
