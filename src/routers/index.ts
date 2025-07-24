import { Router } from 'express';
import { accessRouter } from './access.route';
import { productRouter } from './product.route';
import { shopRouter } from './shop.route';
import { discountRouter } from './discount.route';
// import { rbacRouter } from './rbac.route';
import { cartRouter } from './cart.route';
import { checkoutRouter } from './checkout.route';
const router = Router();

router.use('/access', accessRouter);
router.use('/products', productRouter);
router.use('/discounts', discountRouter);
router.use('/shops', shopRouter);
router.use('/carts', cartRouter);
router.use('/checkout', checkoutRouter);

export const indexRoute = router;
