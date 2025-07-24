import { Router } from 'express';
import checkoutController from '~/controllers/checkout.controller';
import { authMiddleware } from '~/middlewares/auth.middleware';
const router = Router();
router.use(authMiddleware.authentication);
router.get('/review', checkoutController.review);
router.post('/create', checkoutController.create);

export const checkoutRouter = router;
