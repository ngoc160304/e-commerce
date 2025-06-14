import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class SuccessResponse {
  message: string;
  status: number;
  metadata: object | (object | string)[];
  constructor({
    message = '',
    status = StatusCodes.OK,
    reasonStatusCode = StatusCodes[StatusCodes.OK],
    metadata = {}
  }) {
    this.message = message ? message : reasonStatusCode;
    this.status = status;
    this.metadata = metadata;
  }
  send(res: Response) {
    return res.status(this.status).json(this);
  }
}
class OK extends SuccessResponse {
  constructor({ message = '', metadata = {} }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message = StatusCodes[StatusCodes.CREATED],
    metadata = {},
    status = StatusCodes.CREATED
  }) {
    super({ message, metadata, status });
  }
}
export { SuccessResponse, OK, CREATED };
