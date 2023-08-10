import CustomError from './custom.error';
import { StatusCodes } from 'http-status-codes';

class BadRequest extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default BadRequest;
