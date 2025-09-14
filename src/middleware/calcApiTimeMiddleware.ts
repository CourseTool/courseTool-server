import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestTimeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now(); // 记录请求开始时间

    // 在响应结束时计算耗时
    res.on('finish', () => {
      const duration = Date.now() - start;
      Logger.log(
        `[${req.method}] ${req.path} - ${duration}ms  参数:${JSON.stringify(req.query)} IP地址, ${req.ip}`,
      );
    });

    next();
  }
}
