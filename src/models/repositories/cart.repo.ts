import { ObjectId } from 'mongodb';
import mongodb from '~/configs/database';
import { createObjectId } from '~/utils/format';
import { cartModel } from '../cart.model';
import { productModel } from '../product.model';
import { STATUS } from '~/utils/constant';
import { inventoryModel } from '../inventory.model';
const { CART_COLECTION_NAME } = cartModel;
export interface Cart {
  userId: ObjectId;
  products: {
    productId: ObjectId;
    quantity: number;
    variants: { attribute: string; value: string }[] | null;
  }[];
  createdAt: Date;
  updatedAt: Date | null;
}
const getCartUser = async (userId: string) => {
  return await mongodb
    .getDB()
    .collection<Cart>(CART_COLECTION_NAME)
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
          pipeline: [
            {
              $lookup: {
                from: inventoryModel.INVENTORY_COLECTION_NAME,
                localField: '_id',
                foreignField: 'productId',
                as: 'inventorys'
              }
            },
            {
              $match: {
                $and: [{ status: STATUS.ACTIVE }, { _destroy: false }]
              }
            }
          ],
          as: 'productsDetail'
        }
      },
      { $unwind: '$products' },
      { $unwind: '$productsDetail' },
      {
        $project: {
          _id: 1,
          userId: 1,
          createdAt: 1,
          updatedAt: 1,
          products: {
            $cond: {
              if: {
                $eq: ['$products.productId', '$productsDetail._id']
              },
              then: {
                $mergeObjects: [
                  '$products',
                  {
                    title: '$productsDetail.title',
                    thumbnails: '$productsDetail.thumbnails',
                    inventory: '$productsDetail.inventorys',
                    slug: '$productsDetail.slug',
                    stock: '$productsDetail.stock',
                    price: '$productsDetail.price',
                    details: '$productsDetail'
                  }
                ]
              },
              else: null
            }
          }
        }
      },
      { $match: { products: { $ne: null } } },
      { $unwind: '$products.inventory' },
      {
        $project: {
          _id: 1,
          userId: 1,
          createdAt: 1,
          updatedAt: 1,
          products: {
            $cond: {
              if: {
                $eq: ['$products.variants', '$products.inventory.variants']
              },
              then: {
                $mergeObjects: [
                  '$products',
                  {
                    price: '$products.inventory.price',
                    inventory: '$products.details.inventorys',
                    stock: '$products.inventory.stock'
                  }
                ]
              },
              else: null
            }
          }
        }
      },
      {
        $match: {
          products: { $ne: null }
        }
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          products: {
            quantity: 1,
            productId: 1,
            variants: 1,
            title: 1,
            thumbnails: 1,
            inventory: 1,
            slug: 1,
            stock: 1,
            price: 1
          }
        }
      }
    ])
    .toArray();
};

const findOneByUserId = async (userId: string) => {
  try {
    return await mongodb
      .getDB()
      .collection<Cart>(CART_COLECTION_NAME)
      .findOne({
        userId: createObjectId(userId)
      });
  } catch (error) {
    if (error instanceof Error) throw new Error(error.message);
  }
};
const createNew = async (data: Cart) => {
  return await mongodb.getDB().collection<Cart>(CART_COLECTION_NAME).insertOne(data);
};
const update = async (update: object, userId: string) => {
  return await mongodb
    .getDB()
    .collection<Cart>(CART_COLECTION_NAME)
    .findOneAndUpdate(
      {
        userId: createObjectId(userId)
      },
      {
        ...update
      },
      {
        returnDocument: 'after'
      }
    );
};

export const cartRepo = {
  createNew,
  findOneByUserId,
  update,
  getCartUser
};
