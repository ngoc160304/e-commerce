import { ObjectId } from 'mongodb';
import mongodb from '~/configs/database';

const INVENTORY_COLECTION_NAME = 'inventorys';
const INVENTORY_COLLECTION_SCHEMA = {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'shopId',
      'productId',
      'stock',
      'price',
      'thumbnail',
      'createdAt',
      'updatedAt',
      'variants',
      '_destroy'
    ],
    properties: {
      shopId: {
        bsonType: 'objectId'
      },
      productId: {
        bsonType: 'objectId'
      },
      price: {
        bsonType: ['int', 'null'],
        minimum: 1000
      },
      stock: {
        bsonType: ['int', 'null'],
        minimum: 0
      },
      thumbnail: {
        bsonType: ['string']
      },
      variants: {
        bsonType: ['array', 'null'],
        uniqueItems: true,
        additionalProperties: false,
        items: {
          bsonType: 'object',
          required: ['attribute', 'value'],
          properties: {
            attribute: {
              bsonType: 'string'
            },
            value: {
              bsonType: 'string'
            }
          }
        }
      },
      createdAt: {
        bsonType: 'date'
      },
      updatedAt: {
        bsonType: ['date', 'null']
      },
      _destroy: {
        bsonType: ['bool']
      }
    }
  }
};
export interface Inventory {
  shopId: ObjectId;
  productId: ObjectId;
  thumbnail: string;
  variants: { attribute: string; value: string }[] | null;
  stock: number;
  price: number;
  createdAt: Date;
  updatedAt: Date | null;
  _destroy: boolean;
}
const getCollectionInventory = () =>
  mongodb.getDB().collection<Inventory>(INVENTORY_COLECTION_NAME);
export const inventoryModel = {
  INVENTORY_COLECTION_NAME,
  INVENTORY_COLLECTION_SCHEMA,
  getCollectionInventory
};
