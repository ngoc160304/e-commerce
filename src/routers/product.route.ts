import { Router } from 'express';
import productController from '~/controllers/product.controller';
import { authMiddleware } from '~/middlewares/auth.middleware';
import { shopMiddleware } from '~/middlewares/shop.middleware';
// import productValidation from '~/validations/product.validation';
const router = Router();

// user
router.use(authMiddleware.authentication);

// shop
router.use(shopMiddleware.shopAuthentication);
router.post('/create', productController.createNew);
router.put('/update/:productId', productController.update);
router.patch('/change-status/:productId', productController.changeStatusByShop);
router.delete('/delete', productController.deleteProductByShop);
// user
router.get('/list-products', productController.getListProductUser);
export const productRouter = router;
