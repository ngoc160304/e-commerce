import mongodb from '~/configs/database';
import { ObjectId } from 'mongodb';
import { keyStoreModel } from '../keyStore.model';
import { createObjectId } from '~/utils/format';
const { KEY_STORE_COLECTION_NAME } = keyStoreModel;
export interface KeyStore {
  userId: string | ObjectId;
  publicKey: string;
  refreshToken: string;
  refreshTokenUses: string[];
}
const findOneByUserId = async (userId: string) => {
  return await mongodb
    .getDB()
    .collection<KeyStore>(KEY_STORE_COLECTION_NAME)
    .findOne({
      userId: createObjectId(userId)
    });
};

const createNew = async (data: KeyStore) => {
  return await mongodb.getDB().collection<KeyStore>(KEY_STORE_COLECTION_NAME).findOneAndUpdate(
    {
      userId: data.userId
    },
    {
      $set: data
    },
    {
      upsert: true,
      returnDocument: 'after'
    }
  );
};
const update = async (userId: string, data: Partial<KeyStore>, refreshTokenUse: string) => {
  return await mongodb
    .getDB()
    .collection<KeyStore>(KEY_STORE_COLECTION_NAME)
    .updateOne(
      {
        userId: createObjectId(userId)
      },
      { $push: { refreshTokenUses: refreshTokenUse }, $set: data },
      { upsert: true }
    );
};
const deleteByUserId = async (userId: string) => {
  return await mongodb
    .getDB()
    .collection<KeyStore>(KEY_STORE_COLECTION_NAME)
    .deleteOne({ userId: createObjectId(userId) });
};
export const keyStoreRepo = {
  createNew,
  findOneByUserId,
  update,
  deleteByUserId
};
