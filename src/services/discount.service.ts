import { BAD_REQUEST, NOT_FOUND } from '~/core/errors.response';
import { Discount } from '~/models/discount.model';
import { discountRepo } from '~/models/repositories/discount.repo';
import { userDiscountRepo } from '~/models/repositories/userDiscount.repo';
import { UserDiscount } from '~/models/userDiscount.model';
import { DISCOUNT_APPLY, DISCOUNT_TYPES } from '~/utils/constant';
import { createObjectId, customSlug } from '~/utils/format';

class DiscountService {
  static createNew = async (
    data: {
      name: string;
      type: string;
      value: number;
      code: string;
      startDate: Date;
      endDate: Date;
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
    const newUserDiscount: UserDiscount = {
      userId: createObjectId(userId),
      discountId: getDiscount._id,
      used: getDiscount.maxUsePerUser
    };
    const savedDiscount = await userDiscountRepo.createNew(newUserDiscount);
    const getUserDiscount = await userDiscountRepo.findOneById(savedDiscount.insertedId.toString());

    return getUserDiscount ? getUserDiscount : {};
  };
  static discountAmount = async (
    data: {
      price: number;
      discountId: string;
      shopId: string;
      productId: string;
      userDiscountId: string;
    },

    userId: string
  ) => {
    const { shopId, price, productId, userDiscountId } = data;
    const [getDiscount] = await userDiscountRepo.getDiscountByUser(userDiscountId, shopId, userId);
    if (!getDiscount) {
      throw new NOT_FOUND('Discount is not exist !');
    }
    const { discount, used } = getDiscount as { discount: Discount; used: number };
    if (new Date(discount.endDate) < new Date()) {
      throw new BAD_REQUEST('Discount is expried !');
    }
    if (discount.usesCount > discount.maxUses) {
      throw new BAD_REQUEST('Discount code is out of limit !');
    }
    if (used <= 0) {
      throw new BAD_REQUEST('Discount code has exceeded the number of allowed uses !');
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
      finalPrice = price * (discount.value / 100);
    }
    return finalPrice;
  };
  static getDiscountUser = (userId: string) => {};
}
export default DiscountService;
