import { Response } from 'express';

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export const sendSuccess = <T>(res: Response, statusCode: number, data: T) => {
  const response: ApiSuccessResponse<T> = {
    success: true,
    data,
  };
  return res.status(statusCode).json(response);
};

export const sendError = (res: Response, statusCode: number, code: string, message: string) => {
  const response: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
    },
  };
  return res.status(statusCode).json(response);
};
