import { Router } from 'express';
import accessController from '~/controllers/access.controller';
import accessValidation from '~/validations/access.validation';
const router = Router();

router.post('/register', accessValidation.register, accessController.register);

export const accessRouter = router;
