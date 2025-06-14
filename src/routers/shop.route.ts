import { Router } from 'express';
import shopController from '~/controllers/shop.controller';
import { authMiddleware } from '~/middlewares/auth.middleware';
import { ROLE_NAME } from '~/utils/constant';
import shopValidation from '~/validations/shop.validation';
const router = Router();

router.post(
  '/create',
  authMiddleware.authentication,
  authMiddleware.authorization([ROLE_NAME.ADMIN, ROLE_NAME.CLIENT]),
  shopValidation.createNew,
  shopController.createNew
);
router.patch(
  '/verify-shop',
  authMiddleware.authentication,
  authMiddleware.authorization([ROLE_NAME.ADMIN, ROLE_NAME.CLIENT]),
  shopValidation.verifyShop,
  shopController.verifyShop
);

export const shopRouter = router;
