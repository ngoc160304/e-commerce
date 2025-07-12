import { STATUS } from '~/utils/constant';

const CATEGORY_PRODUCT_COLECTION_NAME = 'categorys-product';
const CATEGORY_PRODUCT_COLLECTION_SCHEMA = {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'parentId',
      'title',
      'description',
      'thumbnails',
      'status',
      'createdAt',
      'updatedAt',
      '_destroy'
    ],
    properties: {
      parentId: {
        bsonType: ['objectId', 'null']
      },
      title: {
        bsonType: 'string'
      },
      description: {
        bsonType: 'string'
      },
      status: {
        bsonType: 'string',
        enum: [...Object.values(STATUS)]
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

export const categoryProductModel = {
  CATEGORY_PRODUCT_COLECTION_NAME,
  CATEGORY_PRODUCT_COLLECTION_SCHEMA
};
