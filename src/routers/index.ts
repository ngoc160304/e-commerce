import { Router } from 'express';
import { accessRouter } from './access.route';
import { productRouter } from './product.route';
import { shopRouter } from './shop.route';
const router = Router();

router.use('/access', accessRouter);
router.use('/products', productRouter);
router.use('/shops', shopRouter);

export const indexRoute = router;
