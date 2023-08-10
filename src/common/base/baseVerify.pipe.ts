import { NextFunction } from 'express';
import { BadRequest } from '../../errors';

export default class BasePipe {
  constructor() {}

  required(paramsList, paramsPosition) {}

  mustNumber(paramsList, paramsPosition) {}

  optionalMustNumber(paramsList, paramsPosition) {}

  verifyResultMessage(message: string[], next: NextFunction) {
    if (message.length !== 0) {
      throw new BadRequest(JSON.stringify(message));
    } else {
      next();
    }
  }
}
