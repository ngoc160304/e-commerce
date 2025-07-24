import { Router } from 'express';
import cartController from '~/controllers/cart.controller';
import { authMiddleware } from '~/middlewares/auth.middleware';
const router = Router();

router.use(authMiddleware.authentication);
router.get('/', cartController.getCartUser);

router.post('/add-to-cart', cartController.addToCart);

router.delete('/delete-product/:productId', cartController.deleteProductInCart);

router.patch('/update', cartController.updateCart);

export const cartRouter = router;
