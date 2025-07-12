import { createObjectId } from '~/utils/format';
import { getCollectionUserDiscount, UserDiscount } from '../userDiscount.model';
import { discountModel } from '../discount.model';
const findOneById = async (id: string, filter: Partial<UserDiscount> = {}) => {
  return getCollectionUserDiscount().findOne({
    _id: createObjectId(id),
    ...filter
  });
};
const createNew = async (data: UserDiscount) => {
  return getCollectionUserDiscount().insertOne(data);
};
const getDiscountByUser = async (id: string, shopId: string, userId: string) => {
  return await getCollectionUserDiscount()
    .aggregate([
      {
        $match: {
          _id: createObjectId(id),
          userId: createObjectId(userId)
        }
      },
      {
        $lookup: {
          from: discountModel.DISCOUNT_COLECTION_NAME,
          localField: 'discountId',
          foreignField: '_id',
          pipeline: [
            {
              $match: {
                _destroy: false,
                shopId: createObjectId(shopId)
              }
            }
          ],
          as: 'discount'
        }
      },
      {
        $unwind: '$discount'
      }
    ])
    .toArray();
};
export const userDiscountRepo = {
  findOneById,
  createNew,
  getDiscountByUser
};
