import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async get(key: string): Promise<string> {
    const value = await this.redis.get(key);
    return JSON.parse(value);
  }

  async set(key: string, value: any): Promise<void> {
    if (typeof value === 'string') {
      value = JSON.stringify(value);
    }
    await this.redis.set(key, value);
  }

  setex(key: string, seconds: number, value: any) {
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }
    this.redis.setex(key, seconds, value);
  }
}
