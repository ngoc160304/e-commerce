import { ObjectId } from 'mongodb';
import lodash from 'lodash';

export const createObjectId = (id: string) => {
  return ObjectId.createFromHexString(id);
};
export const pickUser = (ob = {}, pickData = ['']) => {
  return lodash.pick(ob, pickData);
};
