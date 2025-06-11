import { z } from 'zod/v4';
import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from '~/core/errors.response';
class ProductValidation {
  static createNew = async (req: Request, res: Response, next: NextFunction) => {
    const data = z.object({
      title: z.string(),
      descriptions: z.string(),
      thumnmails: z
        .array(
          z.object({
            position: z.int(),
            url: z.url()
          })
        )
        .min(3),
      sold: z.int()
    });
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
export default ProductValidation;
