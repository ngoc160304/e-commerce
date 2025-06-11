import { z } from 'zod/v4';
import { Request, Response, NextFunction } from 'express';
import { BAD_REQUEST } from '~/core/errors.response';
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validations';
class shopValidation {
  static createNew = async (req: Request, res: Response, next: NextFunction) => {
    const data = z.object({
      name: z.string(),
      description: z.string().default(''),
      info_contact: z.object({
        email: z.email({ error: EMAIL_RULE_MESSAGE, pattern: new RegExp(EMAIL_RULE) }),
        phone_number: z.string().optional()
      }),
      password: z.string({ error: PASSWORD_RULE_MESSAGE }).regex(PASSWORD_RULE)
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
  static verifyShop = async (req: Request, res: Response, next: NextFunction) => {
    const data = z.object({
      otp: z.string()
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
export default shopValidation;
