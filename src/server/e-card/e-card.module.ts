import { Module } from '@nestjs/common';
import { StudentCourseService } from './e-card.service';
import { ECardController } from './e-card.controller';

import { RedisService } from '../../redis/redis.service';

@Module({
  imports: [],
  controllers: [ECardController],
  providers: [StudentCourseService, RedisService],
})
export class ECardModule {}
