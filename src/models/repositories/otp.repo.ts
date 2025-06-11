import { createObjectId } from '~/utils/format';
import { productModel } from '../product.model';
import mongodb from '~/configs/database';
import { ObjectId } from 'mongodb';
const { PRODUCT_COLECTION_NAME } = productModel;

interface OTP {
  userId: ObjectId;
  otp: string;
  createdAt: Date;
}
const findOneById = async (id: string) => {
  return await mongodb
    .getDB()
    .collection<OTP>(PRODUCT_COLECTION_NAME)
    .findOne({
      _id: createObjectId(id),
      _destroy: false
    });
};
const createNew = async (data: OTP) => {
  return await mongodb.getDB().collection<OTP>(PRODUCT_COLECTION_NAME).insertOne(data);
};
export const productRepo = {
  createNew,
  findOneById
};
