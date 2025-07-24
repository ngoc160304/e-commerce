import { createObjectId } from '~/utils/format';
import { Discount, getCollectionDiscount } from '../discount.model';
import { DISCOUNT_APPLY } from '~/utils/constant';
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
const getListDiscountProduct = async (
  keyWord: string,
  limitPage: number,
  pageCurrent: number,
  productId: string
) => {
  let query = {};
  if (keyWord) {
    query = {
      code: keyWord
    };
  }
  return await getCollectionDiscount()
    .find({
      _destroy: false,
      endDate: {
        $gt: new Date()
      },
      maxUses: {
        $gt: 0
      },
      $or: [{ productIds: { $all: [productId] } }, { appliesTo: DISCOUNT_APPLY.ALL }],
      ...query
    })

    .limit(limitPage)
    .skip(pageCurrent)
    .toArray();
};
export const discountRepo = {
  createNew,
  findOneById,
  getListDiscountProduct
};
