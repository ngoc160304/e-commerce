import { Router } from 'express';
import productController from '~/controllers/product.controller';
import { authMiddleware } from '~/middlewares/auth.middleware';
import { shopMiddleware } from '~/middlewares/shop.middleware';
// import productValidation from '~/validations/product.validation';
const router = Router();

router.get('/list-products', productController.getListProductUser);
// user
router.use(authMiddleware.authentication);

// shop
router.use(shopMiddleware.shopAuthentication);
router.post('/create', productController.createNew);
router.put('/update/:productId', productController.update);
router.patch('/change-status/:productId', productController.changeStatusByShop);
router.delete('/delete/:productId', productController.deleteProductByShop);
// user
export const productRouter = router;
