import { Request } from 'express';

export interface ServiceReturnVal {
  data?: object;
  error?: Error;
}

export interface MyObject {
  [key: string]: any;
}

export interface TokenUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface CustomeRequest extends Request {
  user?: TokenUser;
  files?: MyObject;
}

export interface Pagination {
  page: number;
  limit: number;
}
