import { DISCOUNT_APPLY, DISCOUNT_TYPES } from '~/utils/constant';

const DISCOUNT_COLECTION_NAME = 'discounts';
const DISCOUNT_COLLECTION_SCHEMA = {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'shopId',
      'name',
      'description',
      'type',
      'value', // giá trị giảm giá của fixed and percentage
      'code',
      'startDate',
      'endDate',
      'maxUses', // số lượng discount được sử dụng
      'usesCount', // số discount đã sử dụng
      'usersUsed', // ai đã sử dụng
      'maxUsePerUser', // số lượng tối đa mà ngươi dùng có thể sử dụng
      'minOrderValue', // giá trị đơn hàng tối thiểu
      'isActive',
      'appliesTo', // dạng áp dụng cho sản phẩm
      'productIds', // id sản phẩm được áp dụng
      'createdAt',
      'updatedAt',
      '_destroy'
    ],
    properties: {
      shopId: {
        bsonType: 'objectId'
      },
      name: {
        bsonType: 'string'
      },
      description: {
        bsonType: 'string'
      },
      type: {
        bsonType: 'string',
        enum: [...Object.values(DISCOUNT_TYPES)]
      },
      value: {
        bsonType: 'number'
      },
      code: {
        bsonType: 'string'
      },
      startDate: {
        bsonType: 'date'
      },
      endDate: {
        bsonType: 'string'
      },
      maxUses: {
        bsonType: 'int'
      },
      usesCount: {
        bsonType: 'int'
      },
      usersUsed: {
        bsonType: 'array',
        items: {
          bsonType: 'object',
          required: ['userId', 'useCount'],
          properties: {
            userId: {
              bsonType: 'objectId'
            },
            useCount: {
              bsonType: 'int'
            }
          }
        }
      },
      maxUsePerUser: {
        bsonType: 'int'
      },
      minOrderValue: {
        bsonType: 'int'
      },
      isActive: {
        bsonType: 'bool'
      },
      appliesTo: {
        bsonType: 'string',
        enum: Object.values(DISCOUNT_APPLY)
      },
      productIds: {
        bsonType: 'array',
        items: {
          bsonType: 'objectId'
        }
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

export const discountModel = {
  DISCOUNT_COLECTION_NAME,
  DISCOUNT_COLLECTION_SCHEMA
};
