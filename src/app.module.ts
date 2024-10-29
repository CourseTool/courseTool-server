import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentCourseModule } from './server/student-course/student-course.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './server/common/common.module';
import { SetCacheHeader } from './utils/SetCacheHeader';
import { TeacherCourseModule } from './server/teacher-course/teacher-course.module';
import { ClassroomCourseModule } from './server/classroom-course/classroom-course.module';
import { CommunityModule } from './server/community/community.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '114.132.175.70',
      // host: 'localhost',
      port: 3306,
      username: 'Course',
      password: 'NRNdLmpmWpx6jMRT',
      // username: 'root',
      // password: '20050703',
      database: 'course',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // synchronize: true,
      autoLoadEntities: true,
      cache: true,
    }),
    StudentCourseModule,
    CommonModule,
    TeacherCourseModule,
    ClassroomCourseModule,
    CommunityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SetCacheHeader).forRoutes('*');
  }
}
