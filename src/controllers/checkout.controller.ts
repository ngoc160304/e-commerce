import { Request, Response, NextFunction } from 'express';
import { CREATED, OK } from '~/core/successes,response';
import CheckoutService from '~/services/checkout.service';
class CheckoutController {
  review = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new OK({
        metadata: await CheckoutService.review(req.body, req.user.userId)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new CREATED({
        metadata: await CheckoutService.createOrder(req.body, req.user.userId)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}
export default new CheckoutController();
