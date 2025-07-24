import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from '~/core/errors.response';
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
      const discountId = req.params.discountId;
      if (!discountId) {
        throw new BAD_REQUEST('Invalid request !');
      }
      new OK({
        metadata: await DiscountService.saveDiscountUser(
          {
            discountId
          },
          req.user.userId
        )
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
  getListDiscountUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new OK({
        metadata: await DiscountService.getListDiscountUser(req.query, req.user.userId)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  getListDiscountProduct = async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.productId;
    if (!productId) {
      throw new BAD_REQUEST();
    }
    try {
      new OK({
        metadata: await DiscountService.getListDiscountProduct(req.query, productId)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}
export default new DiscountController();
