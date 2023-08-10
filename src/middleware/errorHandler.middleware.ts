import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/index';
import { StatusCodes } from 'http-status-codes';

export default function (err, req: Request, res: Response, next: NextFunction) {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ code: StatusCodes.BAD_REQUEST, err_msg: err.message });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    msg: 'Something went wrong try again later',
    info: err.message,
  });
}
