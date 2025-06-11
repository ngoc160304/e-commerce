import { Request, Response, NextFunction } from 'express';
import { CREATED } from '~/core/successes,response';
import ProductService from '~/services/product.service';
class ProductController {
  createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new CREATED({
        metadata: await ProductService.createNew(req.body)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}
export default new ProductController();
