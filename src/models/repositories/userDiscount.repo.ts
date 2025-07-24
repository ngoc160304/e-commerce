import { createObjectId } from '~/utils/format';
import { getCollectionUserDiscount, UserDiscount } from '../userDiscount.model';
import { discountModel } from '../discount.model';
const findOneById = async (id: string, filter: Partial<UserDiscount> = {}) => {
  return getCollectionUserDiscount().findOne({
    _id: createObjectId(id),
    ...filter
  });
};
const checkDiscountUserExist = async (discountId: string, userId: string) => {
  return getCollectionUserDiscount().findOne({
    discountId: createObjectId(discountId),
    userId: createObjectId(userId)
  });
};

const createNew = async (data: UserDiscount) => {
  return getCollectionUserDiscount().findOneAndUpdate(
    {
      discountId: data.discountId
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

const getDiscountByUser = async (discountId: string, userId: string) => {
  return await getCollectionUserDiscount()
    .aggregate([
      {
        $match: {
          discountId: createObjectId(discountId),
          userId: createObjectId(userId)
        }
      },
      {
        $lookup: {
          from: discountModel.DISCOUNT_COLECTION_NAME,
          localField: 'discountId',
          foreignField: '_id',
          as: 'discount'
        }
      },
      {
        $unwind: '$discount'
      }
    ])
    .toArray();
};
const getListDiscountUser = async (
  codeDiscount: string,
  limitPage: number,
  pageCurrent: number,
  userId: string
) => {
  let query = {};
  if (codeDiscount) {
    query = {
      code: codeDiscount
    };
  }
  return await getCollectionUserDiscount()
    .aggregate([
      {
        $match: {
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
                endDate: {
                  $gt: new Date()
                },
                ...query
              }
            }
          ],
          as: 'discounts'
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $skip: pageCurrent
      },
      {
        $limit: limitPage
      }
    ])
    .toArray();
};
const reduceDiscount = async (userDiscountId: string) => {
  return await getCollectionUserDiscount().updateOne(
    {
      _id: createObjectId(userDiscountId)
    },
    { $inc: { used: -1 } }
  );
};
export const userDiscountRepo = {
  findOneById,
  createNew,
  getListDiscountUser,
  checkDiscountUserExist,
  getDiscountByUser,
  reduceDiscount
};
