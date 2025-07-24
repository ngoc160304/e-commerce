import { Router } from 'express';
import discountController from '~/controllers/discount.controller';
import { authMiddleware } from '~/middlewares/auth.middleware';
import { shopMiddleware } from '~/middlewares/shop.middleware';
const router = Router();

router.get('/list-discount-product/:productId', discountController.getListDiscountProduct);

router.use(authMiddleware.authentication);
// user
router.get('/list-discount-user', discountController.getListDiscountUser);
router.post('/discount-amount', discountController.discountAmount);
router.post('/save-discount-user/:discountId', discountController.saveDiscountUser);

// shop
router.use(shopMiddleware.shopAuthentication);
router.post('/create', discountController.createNew);

export const discountRouter = router;
