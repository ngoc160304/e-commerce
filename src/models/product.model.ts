import { Double, ObjectId } from 'mongodb';
import mongodb from '~/configs/database';
import { STATUS } from '~/utils/constant';

const PRODUCT_COLECTION_NAME = 'products';
const PRODUCT_COLLECTION_SCHEMA = {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'shopId',
      'title',
      'slug',
      'description',
      'thumbnails',
      'video',
      'sold',
      'status',
      'ratingAverage',
      'ratingCount',
      'likeCount',
      'specifications',
      'createdAt',
      'updatedAt',
      '_destroy'
    ],
    properties: {
      shopId: {
        bsonType: 'objectId'
      },
      title: {
        bsonType: 'string'
      },
      description: {
        bsonType: 'string'
      },
      slug: {
        bsonType: 'string'
      },
      videos: {
        bsonType: 'string'
      },
      thumbnails: {
        bsonType: 'array',
        minItems: 3,
        uniqueItems: true,
        additionalProperties: false,
        items: {
          bsonType: 'object',
          required: ['position', 'url'],
          properties: {
            position: {
              bsonType: 'int'
            },
            url: {
              bsonType: 'string'
            }
          }
        }
      },
      specifications: {
        bsonType: 'object'
      },
      status: {
        bsonType: 'string',
        enum: [...Object.values(STATUS)]
      },
      sold: {
        bsonType: 'int'
      },
      ratingAverage: {
        bsonType: 'double'
      },

      ratingCount: {
        bsonType: 'int'
      },
      likeCount: {
        bsonType: 'int'
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
export interface Product {
  shopId: ObjectId;
  slug: string;
  title: string;
  description: string;
  thumbnails: { position: string; url: string }[];
  video: string;
  sold: number;
  status: string;
  ratingAverage: Double;
  specifications: object;
  ratingCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date | null;
  _destroy: boolean;
}
const getCollectionProduct = () => mongodb.getDB().collection<Product>(PRODUCT_COLECTION_NAME);

export const productModel = {
  PRODUCT_COLECTION_NAME,
  PRODUCT_COLLECTION_SCHEMA,
  getCollectionProduct
};
