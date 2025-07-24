import { createObjectId } from '~/utils/format';
import { Cart, getCollectionCart } from '../cart.model';
import { ObjectId } from 'mongodb';
import { productModel } from '../product.model';
import { inventoryModel } from '../inventory.model';
const findOneByUserId = async (userId: string) => {
  return await getCollectionCart().findOne({
    userId: createObjectId(userId)
  });
};
const getCartDetailByUserId = async (userId: string) => {
  return await getCollectionCart()
    .aggregate([
      {
        $match: {
          userId: createObjectId(userId)
        }
      },
      {
        $lookup: {
          from: productModel.PRODUCT_COLECTION_NAME,
          localField: 'products.productId',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      {
        $lookup: {
          from: inventoryModel.INVENTORY_COLECTION_NAME,
          localField: 'products.inventoryId',
          foreignField: '_id',
          as: 'inventoryInfo'
        }
      },
      {
        $unwind: '$productInfo'
      },
      {
        $unwind: '$inventoryInfo'
      },

      {
        $project: {
          productInfo: {
            $cond: {
              if: {
                $eq: ['$productInfo._id', '$inventoryInfo.productId']
              },
              then: {
                _id: '$productInfo._id',
                title: '$productInfo.title',
                thumbnail: '$productInfo.thumbnails',
                slug: '$productInfo.slug',
                stock: '$inventoryInfo.stock',
                price: '$inventoryInfo.price',
                inventoryId: '$inventoryInfo._id'
              },
              else: null
            }
          },
          inventoryInfo: 1,
          products: 1
        }
      },
      {
        $unwind: '$products'
      },
      {
        $match: {
          productInfo: {
            $ne: null
          }
        }
      },
      {
        $project: {
          productInfo: {
            $cond: {
              if: {
                $eq: ['$productInfo._id', '$products.productId']
              },
              then: {
                _id: '$productInfo._id',
                title: '$productInfo.title',
                thumbnail: '$inventoryInfo.thumbnail',
                slug: '$productInfo.slug',
                stock: '$inventoryInfo.stock',
                price: '$inventoryInfo.price',
                inventoryId: '$inventoryInfo._id'
              },
              else: null
            }
          },
          quantity: '$products.quantity'
        }
      },
      {
        $match: {
          productInfo: {
            $ne: null
          }
        }
      }
    ])
    .toArray();
};
const createNew = async (data: Cart) => {
  return await getCollectionCart().insertOne(data);
};
const addProduct = async (
  data: { inventoryId: ObjectId; quantity: number; productId: ObjectId },
  userId: string
) => {
  return await getCollectionCart().updateOne(
    {
      userId: createObjectId(userId)
    },
    {
      $push: {
        products: data
      },
      $set: {
        updatedAt: new Date()
      }
    }
  );
};
const updateQtyProduct = async (
  data: { inventoryId: ObjectId; quantity: number },
  userId: string
) => {
  const { inventoryId, quantity } = data;
  return await getCollectionCart().updateOne(
    {
      userId: createObjectId(userId),
      'products.inventoryId': inventoryId
    },
    {
      $set: {
        'products.$.quantity': quantity,
        updatedAt: new Date()
      }
    }
  );
};
const deleteProduct = async (productId: string, userId: string) => {
  return await getCollectionCart().updateOne(
    {
      userId: createObjectId(userId)
    },
    {
      $pull: {
        products: {
          productId: createObjectId(productId)
        }
      }
    }
  );
};
export const cartRepo = {
  createNew,
  findOneByUserId,
  addProduct,
  updateQtyProduct,
  deleteProduct,
  getCartDetailByUserId
};
