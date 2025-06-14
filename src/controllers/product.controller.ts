import { Request, Response, NextFunction } from 'express';
import { CREATED, OK } from '~/core/successes,response';
import ProductService from '~/services/product.service';
class ProductController {
  createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new CREATED({
        metadata: await ProductService.createNew(req.body, req.shop.shopId)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new CREATED({
        metadata: await ProductService.update(req.body, req.params.productId, req.shop.shopId)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  changeStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new CREATED({
        metadata: await ProductService.changesStatus(
          {
            status: req.params.status,
            productId: req.params.productId
          },
          req.shop.shopId
        )
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  getListProductForUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new OK({
        metadata: await ProductService.getListProductForUser(req.query)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  getListProductForSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new OK({
        metadata: await ProductService.getListProductForSeller(req.query, req.shop.shopId)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  getListProductForAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new OK({
        metadata: await ProductService.getListProductForAdmin(req.query)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new CREATED({
        metadata: await ProductService.deleteProduct(req.params.productId, req.shop.shopId)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}
export default new ProductController();
