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
      'ratingCound',
      'likeCount',
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
      ratingCound: {
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

export const productModel = {
  PRODUCT_COLECTION_NAME,
  PRODUCT_COLLECTION_SCHEMA
};
