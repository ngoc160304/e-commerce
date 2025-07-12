import { Request, Response, NextFunction } from 'express';
import { FORBIDDEN } from '~/core/errors.response';
import { shopRepo } from '~/models/repositories/shop.repo';
import { STATUS } from '~/utils/constant';
const shopAuthentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const getShopUser = await shopRepo.findOneByUserId(req.user.userId);
    if (!getShopUser) {
      throw new FORBIDDEN();
    }
    if (getShopUser.status !== STATUS.ACTIVE || getShopUser.isVerified === false) {
      throw new FORBIDDEN();
    }
    req.shop = {
      shopId: getShopUser._id.toString(),
      shopName: getShopUser.name
    };
    next();
  } catch (error) {
    next(error);
  }
};
export const shopMiddleware = {
  shopAuthentication
};
