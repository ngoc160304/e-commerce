import { z } from 'zod/v4';
import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from '~/core/errors.response';
class shopValidation {
  static createNew = async (req: Request, res: Response, next: NextFunction) => {
    const data = z.object({});
    try {
      const newBody = await data.parseAsync(req.body);
      req.body = newBody;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new BAD_REQUEST(error.issues[0].code));
      }
    }
  };
}
export default shopValidation;
