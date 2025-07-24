import { ObjectId } from 'mongodb';
import { ParsedQs } from 'qs';
import { BAD_REQUEST, NOT_FOUND } from '~/core/errors.response';
import { Discount } from '~/models/discount.model';
import { discountRepo } from '~/models/repositories/discount.repo';
import { userDiscountRepo } from '~/models/repositories/userDiscount.repo';
import { UserDiscount } from '~/models/userDiscount.model';
import { DISCOUNT_APPLY, DISCOUNT_TYPES } from '~/utils/constant';
import { createObjectId, customSlug, pagination } from '~/utils/format';

class DiscountService {
  static createNew = async (
    data: {
      name: string;
      type: string;
      value: number;
      code: string;
      startDate: string;
      endDate: string;
      maxUses: number;
      usesCount: number;
      maxUsePerUser: number;
      minOrderValue: number;
      appliesTo: string;
      productIds: string[] | null;
      isPublish: boolean;
    },
    shopId: string
  ) => {
    const newDiscount: Discount = {
      ...data,
      shopId: createObjectId(shopId),
      productIds: data.productIds ? data.productIds.map((i) => createObjectId(i)) : null,
      slug: customSlug(data.name),
      usesCount: 0,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      createdAt: new Date(),
      updatedAt: null,
      _destroy: false
    };
    await discountRepo.createNew(newDiscount);
    return 'Create new discount successfully !';
  };
  static saveDiscountUser = async (
    data: {
      discountId: string;
    },
    userId: string
  ) => {
    const { discountId } = data;
    const getDiscount = await discountRepo.findOneById(discountId);
    if (!getDiscount) {
      throw new NOT_FOUND('Discount is not exist !');
    }
    const getDiscountUser = await userDiscountRepo.checkDiscountUserExist(discountId, userId);
    if (getDiscountUser) {
      throw new BAD_REQUEST('Discount has been saved !');
    }
    const newUserDiscount: UserDiscount = {
      userId: createObjectId(userId),
      discountId: getDiscount._id,
      used: getDiscount.maxUsePerUser,
      createdAt: new Date()
    };
    const savedDiscount = await userDiscountRepo.createNew(newUserDiscount);
    if (!savedDiscount) {
      throw new BAD_REQUEST("Can't save discount !");
    }
    return savedDiscount;
  };
  static discountAmount = async (
    data: {
      price: number;
      discountId: string;
      shopId: string;
      productId: string;
    },

    userId: string
  ) => {
    const { shopId, price, productId, discountId } = data;

    const [getDiscount] = await userDiscountRepo.getDiscountByUser(discountId, userId);
    const { _id, used, discount } = getDiscount as {
      used: number;
      discount: Discount;
      _id: ObjectId;
    };
    if (!getDiscount) {
      throw new NOT_FOUND('Discount is not exist !');
    }

    if (discount.shopId.toString() !== shopId) {
      throw new BAD_REQUEST('Discount is not valid !');
    }
    if (new Date(discount.endDate) < new Date()) {
      throw new BAD_REQUEST('Discount is expried !');
    }
    if (used === 0) {
      throw new BAD_REQUEST('Discount you used exceeded the limit.');
    }
    if (discount.maxUses <= 0) {
      throw new BAD_REQUEST('Discount code is out of limit !');
    }
    if (price < discount.minOrderValue) {
      throw new BAD_REQUEST('The order value is too low !');
    }
    let finalPrice = 0;
    if (discount.appliesTo === DISCOUNT_APPLY.SPECIFIC) {
      if (discount.productIds?.map((i) => i.toString()).includes(productId)) {
        throw new BAD_REQUEST('Discount is not valid !');
      }
    }
    if (discount.type === DISCOUNT_TYPES.FIXED_AMMOUNT) {
      finalPrice = price - discount.value;
    } else {
      finalPrice = price - price * (discount.value / 100);
    }

    return {
      finalPrice: finalPrice > 0 ? Math.round(finalPrice) : 0,
      code: discount.code,
      name: discount.name,
      userDiscountId: _id.toString(),
      discountId
    };
  };
  static getListDiscountUser = async (query: ParsedQs, userId: string) => {
    const { limitPage, pageCurrent } = pagination(query);
    const keyWord = query.codeDiscount?.toString() || '';
    return await userDiscountRepo.getListDiscountUser(keyWord, limitPage, pageCurrent, userId);
  };
  static getListDiscountProduct = async (query: ParsedQs, productId: string) => {
    const { limitPage, pageCurrent } = pagination(query);
    const keyWord = query.code?.toString() || '';
    return await discountRepo.getListDiscountProduct(keyWord, limitPage, pageCurrent, productId);
  };
}
export default DiscountService;
