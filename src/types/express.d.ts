import { ParamsDictionary } from 'express-serve-static-core';
import { Query } from 'express-serve-static-core';
import { JwtUserPayload } from './user';

declare namespace Express {
  export interface Request {
    user: JwtUserPayload;

    params: ParamsDictionary & { idEmpresa?: string };

    query: Query & { idEmpresa?: string };

    body: { idEmpresa?: string; [key: string]: any };
  }
}
