import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from '~/core/errors.response';
import { CREATED } from '~/core/successes,response';
import CartService from '~/services/cart.service';
class CartController {
  addToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new CREATED({
        message: await CartService.addToCart(req.body, req.user.userId)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  deleteProductInCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.params.productId) {
        throw new BAD_REQUEST('Invalid request !');
      }
      new CREATED({
        message: await CartService.deleteProductInCart(req.params.productId, req.user.userId)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  getCartUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new CREATED({
        metadata: await CartService.getCartUser(req.user.userId)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  updateCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new CREATED({
        metadata: await CartService.updateCart(req.body, req.user.userId)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}
export default new CartController();
