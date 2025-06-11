import { Request, Response, NextFunction } from 'express';
import { REFRESH_TOKEN, UNAUTHORIZED } from '~/core/errors.response';
import { keyStoreRepo } from '~/models/repositories/keyStore.repo';
import { JwtProvider } from '~/providers/jwt.provider';
import { HEADERS } from '~/utils/constant';

/**
 * Hàm này dùng đề giải mã token
 * Kiểm tra user có tồn tại trong hệ thống hay không
 */
const authentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clientId = req.headers[HEADERS.CLIENT_ID];
    const accessToken = req.headers[HEADERS.ACCESS_TOKEN] || '';
    if (!clientId) {
      throw new UNAUTHORIZED();
    }
    const getKeyUser = await keyStoreRepo.findOneByUserId(clientId.toString());
    if (!getKeyUser) {
      throw new UNAUTHORIZED();
    }
    const decoedToken = JwtProvider.verifyToken(accessToken.toString(), getKeyUser.publicKey);
    req.user = decoedToken as User;
    return next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'jwt expired') {
        return next(new REFRESH_TOKEN());
      }
    }
    next(error);
  }
};

export const authMiddleware = {
  authentication
};
