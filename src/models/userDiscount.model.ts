import { ObjectId } from 'mongodb';
import mongodb from '~/configs/database';

const USER_DISCOUNT_COLECTION_NAME = 'user-discounts';
const USER_DISCOUNT_COLLECTION_SCHEMA = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['userId', 'discountId', 'used'],
    properties: {
      userId: {
        bsonType: 'objectId'
      },
      discountId: {
        bsonType: 'objectId'
      }
    }
  }
};
export interface UserDiscount {
  userId: ObjectId;
  discountId: ObjectId;
  used: number;
}
const getCollectionUserDiscount = () => {
  return mongodb.getDB().collection<UserDiscount>(USER_DISCOUNT_COLECTION_NAME);
};
export const userDiscountModel = {
  USER_DISCOUNT_COLECTION_NAME,
  USER_DISCOUNT_COLLECTION_SCHEMA
};
export { getCollectionUserDiscount };
