import { ObjectId } from 'mongodb';
import mongodb from '~/configs/database';
import { STATUS_ORDER } from '~/utils/constant';

const ORDER_COLECTION_NAME = 'orders';
const ORDER_COLLECTION_SCHEMA = {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'userId',
      'productInfo',
      'shippingAddress',
      'messageForShop',
      'status',
      'createdAt',
      'updatedAt',
      '_destroy'
    ],
    properties: {
      userId: {
        bsonType: 'objectId'
      },
      productInfo: {
        bsonType: 'object',
        required: ['shopId', 'inventoryId', 'quantity', 'price', 'totalAmount', 'discountId'],
        properties: {
          shopId: { bsonType: 'objectId' },
          inventoryId: { bsonType: 'objectId' },
          price: { bsonType: 'int' },
          discountId: {
            bsonType: ['objectId', 'null']
          },
          totalAmount: {
            bsonType: 'int'
          }
        }
      },
      shippingAddress: {
        bsonType: 'string'
      },
      messageForShop: {
        bsonType: 'string'
      },
      status: {
        bsonType: 'string',
        enum: [...Object.values(STATUS_ORDER)]
      },
      createdAt: {
        bsonType: 'date'
      },
      updatedAt: {
        bsonType: ['date', 'null']
      },
      _destroy: {
        bsonType: 'bool'
      }
    }
  }
};
export interface Order {
  userId: ObjectId;
  productInfo: {
    productId: ObjectId;
    shopId: ObjectId;
    inventoryId: ObjectId;
    quantity: number;
    price: number;
    totalAmount: number;
    discountId: ObjectId | null;
  };
  shippingAddress: string;
  messageForShop: string;
  status: string;
  createdAt: Date;
  updatedAt: Date | null;
  _destroy: boolean;
}
const getCollectionOrder = () => mongodb.getDB().collection<Order>(ORDER_COLECTION_NAME);

export { getCollectionOrder };
export const orderModel = {
  ORDER_COLECTION_NAME,
  ORDER_COLLECTION_SCHEMA
};
