import { Router } from 'express';
import productController from '~/controllers/product.controller';
// import { authMiddleware } from '~/middlewares/auth.middleware';
import productValidation from '~/validations/product.validation';
const router = Router();

router.post('/create', productValidation.createNew, productController.createNew);

export const productRouter = router;
