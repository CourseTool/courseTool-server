import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { AICtxDto } from './dto/AICtxDto';
import type { Response } from 'express';

@ApiTags('AI功能接口')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('/')
  async main(@Body() body: AICtxDto, @Res() res: Response) {
    // return this.aiService.stream(body);

    try {
      // 设置 SSE 响应头
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');

      res.status(200);

      // 发送开始信号
      res.write('data: {"type": "start"}\n\n');

      // 流式返回 AI 数据
      for await (const chunk of this.aiService.stream(body)) {
        const data = JSON.stringify({ type: 'chunk', content: chunk });
        res.write(`data: ${data}\n\n`);
      }

      // 发送结束信号
      res.write('data: {"type": "end"}\n\n');
      res.end();
    } catch (error) {
      // 错误处理
      const errorData = JSON.stringify({
        type: 'error',
        error: '服务器内部错误',
        message: error.message,
      });
      res.write(`data: ${errorData}\n\n`);
      res.end();
    }
  }
}
