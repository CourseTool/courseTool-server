import { Module } from '@nestjs/common';
import { StudentCourseService } from './student-course.service';
import { StudentCourseController } from './student-course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentCourseEntity } from '../../entities/student-course.entity';
import { RedisCacheModule } from '../../redis/redis.module';
import { RedisService } from '../../redis/redis.service';
import { ClassListEntity } from '../../entities/class-list.entity';
import { TechCourseEntity } from '../../entities/tech_course.entity';

@Module({
  imports: [
    RedisCacheModule,
    TypeOrmModule.forFeature([
      StudentCourseEntity,
      ClassListEntity,
      TechCourseEntity,
    ]),
  ],
  controllers: [StudentCourseController],
  providers: [StudentCourseService, RedisService],
})
export class StudentCourseModule {}
