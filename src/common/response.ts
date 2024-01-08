import { NextFunction, Response } from 'express';
import { ServiceReturnVal } from '../types/comman';
import { isEmpty } from './app_functions';
import constants from './constants';

export class RespError extends Error {
  public code: number = 0;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }

  public static validation(message: string, code: number = constants.RESP_ERR_CODES.ERR_400): Error {
    return new RespError(code, message);
  }
}

export class ResponseHandler {
  private response?: Response;

  public resp(response: Response) {
    this.response = response;
    return this;
  }

  public send(data: ServiceReturnVal, next?: NextFunction) {
    if (data.error) {
      this.response!.status((data.error as RespError).code).json({ error: data.error.message });
      if (!isEmpty(next)) next(data.error);
    } else {
      this.response!.json(data);
    }
  }

  public error(error: Error, next?: NextFunction) {
    this.response!.status((error as RespError).code).json({ error: error.message });
    if (!isEmpty(next)) next(error);
  }
}
