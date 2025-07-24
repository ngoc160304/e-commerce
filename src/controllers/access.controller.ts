import { Request, Response, NextFunction } from 'express';
import { OK } from '~/core/successes,response';
import AccessService from '~/services/access.service';
import { HEADERS } from '~/utils/constant';
class AccessController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new OK({
        message: await AccessService.register(req.body)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new OK({
        metadata: await AccessService.login(req.body)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new OK({
        message: await AccessService.verifyAccount(req.body)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new OK({
        metadata: await AccessService.refreshToken({
          refreshTokenClient: req.headers[HEADERS.REFRESH_TOKEN]?.toString() || '',
          clientId: req.headers[HEADERS.CLIENT_ID]?.toString() || ''
        })
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new OK({
        message: await AccessService.logout(req.user)
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}
export default new AccessController();
