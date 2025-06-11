import { StatusCodes } from 'http-status-codes';

class ErrorResponse extends Error {
  statusCode: number;
  constructor(message = '', statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
  }
}
class BAD_REQUEST extends ErrorResponse {
  constructor(
    message = StatusCodes[StatusCodes.BAD_REQUEST],
    statusCode = StatusCodes.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}
class FORBIDDEN extends ErrorResponse {
  constructor(message = StatusCodes[StatusCodes.FORBIDDEN], statusCode = StatusCodes.FORBIDDEN) {
    super(message, statusCode);
  }
}
class CONFLICT extends ErrorResponse {
  constructor(message = StatusCodes[StatusCodes.CONFLICT], statusCode = StatusCodes.CONFLICT) {
    super(message, statusCode);
  }
}
class NOT_FOUND extends ErrorResponse {
  constructor(message = StatusCodes[StatusCodes.NOT_FOUND], statusCode = StatusCodes.NOT_FOUND) {
    super(message, statusCode);
  }
}
class UNAUTHORIZED extends ErrorResponse {
  constructor(
    message = StatusCodes[StatusCodes.UNAUTHORIZED],
    statusCode = StatusCodes.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

class REFRESH_TOKEN extends ErrorResponse {
  constructor(message = StatusCodes[StatusCodes.GONE], statusCode = StatusCodes.GONE) {
    super(message, statusCode);
  }
}
export { ErrorResponse, BAD_REQUEST, FORBIDDEN, CONFLICT, NOT_FOUND, UNAUTHORIZED, REFRESH_TOKEN };
