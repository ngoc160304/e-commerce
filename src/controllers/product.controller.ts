import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from '~/core/errors.response';
import { OK } from '~/core/successes,response';
import ProductService from '~/services/product.service';
class ProductController {
  // shop
  createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new OK({
        message: await ProductService.createNew(req.body, req.shop.shopId)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new OK({
        message: await ProductService.update(req.body, req.params.productId, req.shop.shopId)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  changeStatusByShop = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new OK({
        message: await ProductService.changeStatusByShop(
          req.body,
          req.params.productId,
          req.shop.shopId
        )
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  deleteProductByShop = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.params.productId) {
        throw new BAD_REQUEST('Invalid request !');
      }
      new OK({
        metadata: await ProductService.deleteProductByShop(req.params.productId, req.shop.shopId)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  // user
  getListProductUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new OK({
        metadata: await ProductService.getListProductUser(req.query)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}
export default new ProductController();
