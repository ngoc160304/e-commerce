import { Request, Response, NextFunction } from 'express';
import { CREATED } from '~/core/successes,response';
class shopController {
  createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
      new CREATED({}).send(res);
    } catch (error) {
      next(error);
    }
  };
}
export default new shopController();
