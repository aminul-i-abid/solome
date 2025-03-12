import { TokenPayload } from 'src/utils/token.util';

declare module 'express' {
  export interface Request {
    user: TokenPayload;
  }
}
