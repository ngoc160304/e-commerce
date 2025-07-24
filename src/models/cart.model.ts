import { ObjectId } from 'mongodb';
import mongodb from '~/configs/database';

const CART_COLECTION_NAME = 'carts';
const CART_COLLECTION_SCHEMA = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['userId', 'products', 'createdAt', 'updatedAt'],
    properties: {
      userId: {
        bsonType: 'objectId'
      },
      products: {
        bsonType: ['array'],
        items: {
          bsonType: 'object',
          required: ['productId', 'inventoryId', 'quantity'],
          properties: {
            inventoryId: { bsonType: 'objectId' },
            productId: { bsonType: 'objectId' },
            quantity: { bsonType: 'int' }
          }
        }
      },
      createdAt: {
        bsonType: 'date'
      },
      updatedAt: {
        bsonType: ['date', 'null']
      }
    }
  }
};
export interface Cart {
  userId: ObjectId;
  products: { productId: ObjectId; inventoryId: ObjectId; quantity: number }[];
  createdAt: Date;
  updatedAt: Date | null;
}
const getCollectionCart = () => {
  return mongodb.getDB().collection<Cart>(CART_COLECTION_NAME);
};
export const cartModel = {
  CART_COLECTION_NAME,
  CART_COLLECTION_SCHEMA
};
export { getCollectionCart };
