import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class SetCacheHeader implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('请求路径', req.baseUrl, '参数:', req.query);
    res.setHeader('Cache-Control', 'max-age=14400');
    next();
  }
}
