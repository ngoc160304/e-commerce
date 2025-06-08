import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import env from '~/configs/environments';
import { ErrorResponse } from '~/core/errors.response';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandling = (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
  const response = {
    message: err.message,
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    stack: err.stack
  };

  if (env.BUILD_MODE === 'dev') {
    delete err.stack;
  }
  res.status(response.statusCode).json(response);
};
export { errorHandling };
