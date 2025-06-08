import { Router } from 'express';
import { accessRouter } from './access.route';
const router = Router();

router.use('/access', accessRouter);

export const indexRoute = router;
