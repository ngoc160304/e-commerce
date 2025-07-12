import { Request, Response, NextFunction } from 'express';
import { CREATED } from '~/core/successes,response';
import ShopService from '~/services/shop.service';
class shopController {
  createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new CREATED({
        metadata: await ShopService.createNew(req.body, req.user)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  verifyShop = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new CREATED({
        metadata: await ShopService.verifyShop(req.body, req.user)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}
export default new shopController();
