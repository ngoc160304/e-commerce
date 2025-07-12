import { Router } from 'express';
import discountController from '~/controllers/discount.controller';
import { authMiddleware } from '~/middlewares/auth.middleware';
import { shopMiddleware } from '~/middlewares/shop.middleware';
const router = Router();

router.use(authMiddleware.authentication);
// user
router.post('/discount-amount', discountController.discountAmount);
router.post('/save-discount-user', discountController.saveDiscountUser);

// shop
router.use(shopMiddleware.shopAuthentication);
router.post('/create', discountController.createNew);

export const discountRouter = router;
