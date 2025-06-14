import { Router } from 'express';
import productController from '~/controllers/product.controller';
import { authMiddleware } from '~/middlewares/auth.middleware';
import { shopMiddleware } from '~/middlewares/shop.middleware';
import { ROLE_NAME } from '~/utils/constant';
import productValidation from '~/validations/product.validation';
const router = Router();
// client
router.get('/client/list-products', productController.getListProductForUser);

router.post(
  '/create',
  authMiddleware.authentication,
  authMiddleware.authorization([ROLE_NAME.SELLER]),
  shopMiddleware.shopAuthentication,
  productValidation.createNew,
  productController.createNew
);

router.patch(
  '/change-status/:status/:productId',
  authMiddleware.authentication,
  authMiddleware.authorization([ROLE_NAME.SELLER]),
  shopMiddleware.shopAuthentication,
  productController.changeStatus
);
router.patch(
  '/update/:productId',
  authMiddleware.authentication,
  authMiddleware.authorization([ROLE_NAME.SELLER]),
  shopMiddleware.shopAuthentication,
  productValidation.update,
  productController.update
);

router.get(
  '/seller/list-products',
  authMiddleware.authentication,
  authMiddleware.authorization([ROLE_NAME.SELLER]),
  shopMiddleware.shopAuthentication,
  productController.getListProductForSeller
);
router.get(
  '/admin/list-products',
  authMiddleware.authentication,
  authMiddleware.authorization([ROLE_NAME.ADMIN]),
  shopMiddleware.shopAuthentication,
  productController.getListProductForAdmin
);
router.delete(
  '/delete/:productId',
  authMiddleware.authentication,
  shopMiddleware.shopAuthentication,
  productController.deleteProduct
);
export const productRouter = router;
