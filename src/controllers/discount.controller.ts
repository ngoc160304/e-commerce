import { Request, Response, NextFunction } from 'express';
import { CREATED, OK } from '~/core/successes,response';
import DiscountService from '~/services/discount.service';
class DiscountController {
  createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new CREATED({
        message: await DiscountService.createNew(req.body, req.shop.shopId)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  saveDiscountUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new OK({
        metadata: await DiscountService.saveDiscountUser(req.body, req.user.userId)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  discountAmount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new OK({
        metadata: await DiscountService.discountAmount(req.body, req.user.userId)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}
export default new DiscountController();
