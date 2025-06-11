import { createObjectId } from '~/utils/format';
import { otpModel } from '../otp.model';
import mongodb from '~/configs/database';
import { ObjectId } from 'mongodb';
const { OTP_COLECTION_NAME } = otpModel;

interface OTP {
  userId: ObjectId;
  otp: string;
  createdAt: Date;
}
const findOneById = async (id: string) => {
  return await mongodb
    .getDB()
    .collection<OTP>(OTP_COLECTION_NAME)
    .findOne({
      _id: createObjectId(id)
    });
};
const findOneByUserId = async (userId: string) => {
  return await mongodb
    .getDB()
    .collection<OTP>(OTP_COLECTION_NAME)
    .findOne({
      userId: createObjectId(userId)
    });
};
const createNew = async (data: OTP) => {
  return await mongodb.getDB().collection<OTP>(OTP_COLECTION_NAME).insertOne(data);
};
export const otpRepo = {
  createNew,
  findOneById,
  findOneByUserId
};
