import mongodb from '~/configs/database';
import { userModel } from '../user.model';
import { createObjectId } from '~/utils/format';
const { USER_COLECTION_NAME } = userModel;
interface User {
  username: string;
  email: string;
  phone?: string;
  password: string;
  displayName: string;
  gender: string;
  avatar: string | null;
  status: string;
  verifyToken: string | null;
  dateOfBirth: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date | null;
  _destroy: boolean;
}

const findOneById = async (id: string) => {
  return await mongodb
    .getDB()
    .collection<User>(USER_COLECTION_NAME)
    .findOne({
      _id: createObjectId(id),
      _destroy: false
    });
};

const findOneByEmail = async (email: string, filter?: object) => {
  return await mongodb
    .getDB()
    .collection<User>(USER_COLECTION_NAME)
    .findOne({
      email: email,
      _destroy: false,
      ...filter
    });
};
const findOneByVerifyToken = async (verifyToken: string) => {
  return await mongodb.getDB().collection<User>(USER_COLECTION_NAME).findOne({
    verifyToken: verifyToken,
    _destroy: false
  });
};
const createNew = async (data: User) => {
  return await mongodb.getDB().collection<User>(USER_COLECTION_NAME).insertOne(data);
};
const update = async (data: Partial<User>, userId: string) => {
  return await mongodb
    .getDB()
    .collection<User>(USER_COLECTION_NAME)
    .updateOne(
      {
        _id: createObjectId(userId),
        _destroy: false
      },
      {
        $set: data
      }
    );
};

export const userRepo = {
  findOneByEmail,
  findOneById,
  findOneByVerifyToken,
  createNew,
  update
};
