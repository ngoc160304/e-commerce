import mongodb from '~/configs/database';
import { userModel } from '../user.model';
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
  verifyToken: string;
  dateOfBirth: string | null;
  roles: string[];
  createdAt: Date;
  updatedAt: Date | null;
}

const findOneByEmail = async (email: string) => {
  return await mongodb.getDB().collection<User>(USER_COLECTION_NAME).findOne({
    email: email,
    _destroy: false
  });
};
const createNew = async (data: User) => {
  return await mongodb.getDB().collection<User>(USER_COLECTION_NAME).insertOne(data);
};
export const userRepo = {
  findOneByEmail,
  createNew
};
