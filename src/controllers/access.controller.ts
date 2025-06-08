import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import AccessService from '~/services/access.service';
class AccessController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await AccessService.register(req.body);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  };
}
export default new AccessController();
