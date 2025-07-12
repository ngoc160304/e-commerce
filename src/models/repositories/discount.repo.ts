import { createObjectId } from '~/utils/format';
import { Discount, getCollectionDiscount } from '../discount.model';
const findOneById = async (id: string, filter: Partial<Discount> = {}) => {
  return getCollectionDiscount().findOne({
    _id: createObjectId(id),
    _destroy: false,
    ...filter
  });
};
const createNew = async (data: Discount) => {
  return await getCollectionDiscount().insertOne(data);
};
export const discountRepo = {
  createNew,
  findOneById
};
