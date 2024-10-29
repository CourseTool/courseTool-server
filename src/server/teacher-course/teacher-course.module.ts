import { Module } from '@nestjs/common';
import { TeacherCourseService } from './teacher-course.service';
import { TeacherCourseController } from './teacher-course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechCourseEntity } from '../../entities/tech_course.entity';
import { RedisCacheModule } from '../../redis/redis.module';
import { RedisService } from '../../redis/redis.service';
import { TechListEntity } from '../../entities/tech_list.entity';

@Module({
  imports: [
    RedisCacheModule,
    TypeOrmModule.forFeature([TechCourseEntity, TechListEntity]),
  ],
  controllers: [TeacherCourseController],
  providers: [TeacherCourseService, RedisService],
})
export class TeacherCourseModule {}
