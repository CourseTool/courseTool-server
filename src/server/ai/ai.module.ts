import { Module } from '@nestjs/common';
import { RedisCacheModule } from '../../redis/redis.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { StudentCourseEntity } from 'src/entities/student-course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisService } from 'src/redis/redis.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([StudentCourseEntity]),
        RedisCacheModule
    ],
    controllers: [AiController],
    providers: [AiService, RedisService],
})
export class AIModule { }
