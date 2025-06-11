import { STATUS } from '~/utils/constant';
import { EMAIL_RULE } from '~/utils/validations';

const PRODUCT_COLECTION_NAME = 'products';
const PRODUCT_COLLECTION_SCHEMA = {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'shopId',
      'title',
      'slug',
      'descriptions',
      'thumnmails',
      'sold',
      'status',
      'createdAt',
      'updatedAt',
      '_destroy'
    ],
    properties: {
      title: {
        bsonType: 'string'
      },
      descriptions: {
        bsonType: 'string',
        pattern: EMAIL_RULE
      },
      slug: {
        bsonType: 'string'
      },
      thumnmails: {
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
