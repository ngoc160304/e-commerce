import { Router } from 'express';
import shopController from '~/controllers/shop.controller';
import { authMiddleware } from '~/middlewares/auth.middleware';
import shopValidation from '~/validations/shop.validation';
const router = Router();

router.use(authMiddleware.authentication);
router.post('/create', shopValidation.createNew, shopController.createNew);
router.patch('/verify-shop', shopValidation.verifyShop, shopController.verifyShop);

export const shopRouter = router;
