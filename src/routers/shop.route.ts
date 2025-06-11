import { Router } from 'express';
import shopController from '~/controllers/shop.controller';
// import { authMiddleware } from '~/middlewares/auth.middleware';
import shopValidation from '~/validations/shop.validation';
const router = Router();

// khi xác nhận tạo shop chỉ cần kiểm tra có tồn tại trong db hay không r lấy dữ liệu mới cập nhật lại trong db
router.post('/create', shopValidation.createNew, shopController.createNew);

export const shopRouter = router;
