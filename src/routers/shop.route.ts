import { Router } from 'express';
import shopController from '~/controllers/shop.controller';
import { authMiddleware } from '~/middlewares/auth.middleware';
import { ROLE_NAME } from '~/utils/constant';
import shopValidation from '~/validations/shop.validation';
const router = Router();

// khi xác nhận tạo shop chỉ cần kiểm tra có tồn tại trong db hay không r lấy dữ liệu mới cập nhật lại trong db
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
