import { Router } from 'express';
import accessController from '~/controllers/access.controller';
import { authMiddleware } from '~/middlewares/auth.middleware';
import accessValidation from '~/validations/access.validation';
const router = Router();

router.post('/register', accessValidation.register, accessController.register);
router.post('/login', accessValidation.login, accessController.login);
router.put('/verify-account', accessValidation.verifyAccount, accessController.verifyAccount);
router.post('/refresh-token', accessController.refreshToken);
router.delete('/logout', authMiddleware.authentication, accessController.logout);

export const accessRouter = router;
