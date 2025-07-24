import { Request, Response, NextFunction } from 'express';
import { FORBIDDEN, REFRESH_TOKEN, UNAUTHORIZED } from '~/core/errors.response';
import { keyStoreRepo } from '~/models/repositories/keyStore.repo';
import { JwtProvider } from '~/providers/jwt.provider';
import { userRedis } from '~/redis/user.redis';
import { HEADERS } from '~/utils/constant';

/**
 * Hàm này dùng đề giải mã token
 * Kiểm tra user có tồn tại trong hệ thống hay không
 */
const authentication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clientId = req.headers[HEADERS.CLIENT_ID]?.toString();
    const accessToken = req.headers[HEADERS.ACCESS_TOKEN]?.toString();
    if (!clientId || !accessToken) {
      throw new UNAUTHORIZED();
    }
    const getKeyRedis = await userRedis.getKeyStore(`rfToken:${clientId}`);
    if (getKeyRedis) {
      const decodedToken = JwtProvider.verifyToken(accessToken, getKeyRedis.publicKey) as User;
      req.user = decodedToken;
    } else {
      const getKeyUser = await keyStoreRepo.findOneByUserId(clientId);
      if (!getKeyUser) {
        throw new UNAUTHORIZED();
      }
      const decodedToken = JwtProvider.verifyToken(accessToken, getKeyUser.publicKey) as User;
      req.user = decodedToken;
    }
    return next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'jwt expired') {
        return next(new REFRESH_TOKEN());
      }
    }
    next(new UNAUTHORIZED());
  }
};
const authorization = (role: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (role.includes(req.user.role.toString())) {
      return next();
    }
    return next(new FORBIDDEN("Your doesn't allow this api !"));
  };
};

export const authMiddleware = {
  authentication,
  authorization
};
