import CustomError from './custom.error';
import { StatusCodes } from 'http-status-codes';

class AuthErrorRequest extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default AuthErrorRequest;
