import { Module } from '@nestjs/common';
import { ClassroomCourseService } from './classroom-course.service';
import { ClassroomCourseController } from './classroom-course.controller';
import { RedisCacheModule } from '../../redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomListEntity } from '../../entities/classroom-list.entity';
import { TechCourseEntity } from '../../entities/tech_course.entity';
import { ClassroomCourseEntity } from 'src/entities/classroomCourse.entity';

@Module({
  imports: [
    RedisCacheModule,
    TypeOrmModule.forFeature([ClassroomListEntity, TechCourseEntity, ClassroomCourseEntity]),
  ],
  controllers: [ClassroomCourseController],
  providers: [ClassroomCourseService],
})
export class ClassroomCourseModule { }
