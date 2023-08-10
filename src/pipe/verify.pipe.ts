import { NextFunction, Request, Response } from 'express';
import { isNumber } from '../common/utils/index';
import { ParamsPosition } from '../common/enum';
import BasePipe from '../common/base/baseVerify.pipe';

class VerifyParamsPipe extends BasePipe {
  // 参数校验 必填参数
  required(paramsList: string[], paramsPosition = ParamsPosition.BODY) {
    return (req: Request, res: Response, next: NextFunction) => {
      const message = [];

      for (let i = 0; i < paramsList.length; i++) {
        if (paramsPosition === ParamsPosition.REQ) {
          if (!req[paramsList[i]]) {
            message.push(`${paramsList[i]} 参数不能为空`);
          }
        } else {
          if (!req[paramsPosition][paramsList[i]]) {
            message.push(`${paramsList[i]} 参数不能为空`);
          }
        }
      }

      this.verifyResultMessage(message, next);
    };
  }

  // 参数检验 是否为数字
  mustNumber(paramsList: string[], paramsPosition = ParamsPosition.BODY) {
    return (req: Request, res: Response, next: NextFunction) => {
      const message = [];
      for (let i = 0; i < paramsList.length; i++) {
        if (paramsPosition === ParamsPosition.REQ) {
          if (!isNumber(req[paramsList[i]])) {
            message.push(`${paramsList[i]} 应该为数字`);
          }
        } else {
          if (!isNumber(req[paramsPosition][paramsList[i]])) {
            message.push(`${paramsList[i]} 应该为数字`);
          }
        }
      }

      this.verifyResultMessage(message, next);
    };
  }

  // 可选类型参数校验
  optionalMustNumber(paramsList: string[], paramsPosition = ParamsPosition.BODY) {
    return (req: Request, res: Response, next: NextFunction) => {
      const message = [];
      for (let i = 0; i < paramsList.length; i++) {
        if (paramsPosition === ParamsPosition.REQ) {
          if (req[paramsList[i]] && !isNumber(req[paramsList[i]])) {
            message.push(`${paramsList[i]} 应该为数字`);
          }
        } else {
          if (req[paramsPosition][paramsList[i]] && !isNumber(req[paramsPosition][paramsList[i]])) {
            message.push(`${paramsList[i]} 应该为数字`);
          }
        }
      }

      this.verifyResultMessage(message, next);
    };
  }
}

export default new VerifyParamsPipe();
