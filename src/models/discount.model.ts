import { Double, ObjectId } from 'mongodb';
import mongodb from '~/configs/database';
import { DISCOUNT_APPLY, DISCOUNT_TYPES } from '~/utils/constant';

const DISCOUNT_COLECTION_NAME = 'discounts';
const DISCOUNT_COLLECTION_SCHEMA = {
  $jsonSchema: {
    bsonType: 'object',
    required: [
      'shopId',
      'name',
      'type',
      'slug',
      'value', // giá trị giảm giá của fixed and percentage
      'code',
      'startDate',
      'endDate',
      'maxUses', // số lượng discount được sử dụng
      'usesCount', // số discount đã sử dụng
      'maxUsePerUser', // số lượng tối đa mà ngươi dùng có thể sử dụng
      'minOrderValue', // giá trị đơn hàng tối thiểu
      'appliesTo', // dạng áp dụng cho sản phẩm
      'productIds', // id sản phẩm được áp dụng
      'isPublish',
      'createdAt',
      'updatedAt',
      '_destroy'
    ],
    properties: {
      shopId: {
        bsonType: ['objectId', 'null']
      },
      name: {
        bsonType: 'string'
      },
      slug: {
        bsonType: 'string'
      },
      type: {
        bsonType: 'string',
        enum: [...Object.values(DISCOUNT_TYPES)]
      },
      value: {
        bsonType: ['int']
      },
      code: {
        bsonType: 'string'
      },
      startDate: {
        bsonType: 'date'
      },
      endDate: {
        bsonType: 'date'
      },
      maxUses: {
        bsonType: 'int'
      },
      usesCount: {
        bsonType: 'int'
      },
      maxUsePerUser: {
        bsonType: 'int'
      },
      minOrderValue: {
        bsonType: 'int'
      },

      appliesTo: {
        bsonType: 'string',
        enum: [...Object.values(DISCOUNT_APPLY)]
      },
      productIds: {
        bsonType: ['array', 'null'],
        items: {
          bsonType: 'objectId'
        }
      },
      isPublish: {
        bsonType: 'bool'
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

export interface Discount {
  shopId: ObjectId;
  name: string;
  type: string;
  value: number;
  slug: string;
  code: string;
  startDate: Date;
  endDate: Date;
  maxUses: number;
  usesCount: number;
  maxUsePerUser: number;
  minOrderValue: number;
  appliesTo: string;
  productIds: ObjectId[] | null;
  isPublish: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  _destroy: boolean;
}
const getCollectionDiscount = () => {
  return mongodb.getDB().collection<Discount>(DISCOUNT_COLECTION_NAME);
};
export const discountModel = {
  DISCOUNT_COLECTION_NAME,
  DISCOUNT_COLLECTION_SCHEMA
};
export { getCollectionDiscount };
