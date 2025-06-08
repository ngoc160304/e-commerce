import { z } from 'zod/v4';
import { BAD_REQUEST } from '~/core/errors.response';
import { GENDER } from '~/utils/constant';
import { Request, Response, NextFunction } from 'express';
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validations';
class AccessValidate {
  static register = async (req: Request, res: Response, next: NextFunction) => {
    const data = z.object({
      email: z.email({ error: EMAIL_RULE_MESSAGE, pattern: new RegExp(EMAIL_RULE) }),
      phone: z.string().optional(),
      gender: z.enum([...Object.values(GENDER)]).default(GENDER.MALE),
      password: z.string({ error: PASSWORD_RULE_MESSAGE }).regex(PASSWORD_RULE)
    });
    try {
      await data.parseAsync(req.body);
      next();
    } catch (error) {
      console.error(error);
      if (error instanceof z.ZodError) {
        next(new BAD_REQUEST(error.message));
      }
      next(new BAD_REQUEST('Data is not allow !'));
    }
  };
}
export default AccessValidate;
