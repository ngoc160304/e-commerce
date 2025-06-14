import { createObjectId } from '~/utils/format';
import { shopModel } from '../shop.model';
import mongodb from '~/configs/database';
import { ObjectId } from 'mongodb';
const { SHOP_COLECTION_NAME } = shopModel;

interface SHOP {
  userId: ObjectId;
  name: string;
  password: string;
  slug: string;
  description: string;
  logo_url: string | null;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  info_contact: {
    email: string;
    phone_number?: string;
  };
  total_followers: number;
  status: string;
  _destroy: boolean;
}
const findOneById = async (id: string) => {
  return await mongodb
    .getDB()
    .collection<SHOP>(SHOP_COLECTION_NAME)
    .findOne({
      _id: createObjectId(id),
      _destroy: false
    });
};
const findOneByUserId = async (userId: string) => {
  return await mongodb
    .getDB()
    .collection<SHOP>(SHOP_COLECTION_NAME)
    .findOne({
      userId: createObjectId(userId),
      _destroy: false
    });
};
const createNew = async (data: SHOP) => {
  return await mongodb
    .getDB()
    .collection<SHOP>(SHOP_COLECTION_NAME)
    .findOneAndUpdate(
      { userId: data.userId },
      { $set: data },
      { upsert: true, returnDocument: 'after' }
    );
};
const updateByUser = async (data: Partial<SHOP>, userId: string) => {
  return await mongodb
    .getDB()
    .collection<SHOP>(SHOP_COLECTION_NAME)
    .findOneAndUpdate(
      { userId: createObjectId(userId) },
      { $set: data },
      { returnDocument: 'after', projection: { password: 1 } }
    );
};

export const shopRepo = {
  createNew,
  findOneById,
  findOneByUserId,
  updateByUser
};
