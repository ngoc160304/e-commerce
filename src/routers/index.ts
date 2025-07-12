import { Router } from 'express';
import { accessRouter } from './access.route';
import { productRouter } from './product.route';
import { shopRouter } from './shop.route';
import { discountRouter } from './discount.route';
// import { rbacRouter } from './rbac.route';
// import { cartRoute } from './cart.route';
// import { checkoutRoute } from './checkout.route';
const router = Router();

router.use('/access', accessRouter);
router.use('/products', productRouter);
router.use('/discounts', discountRouter);
router.use('/shops', shopRouter);
// router.use('/carts', cartRoute);
// router.use('/checkout', checkoutRoute);
// router.use('/rbac', rbacRouter);

export const indexRoute = router;
