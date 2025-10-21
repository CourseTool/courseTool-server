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
import { RequestTimeMiddleware } from './middleware/calcApiTimeMiddleware';
import { AIModule } from './server/ai/ai.module';
import { ECardModule } from './server/e-card/e-card.module';
import { UserModule } from './server/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '123.56.64.221',
      port: 3306,
      username: 'course',
      password: '050703',
      database: 'course',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      cache: true,
    }),
    StudentCourseModule,
    CommonModule,
    TeacherCourseModule,
    ClassroomCourseModule,
    CommunityModule,
    AIModule,
    ECardModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SetCacheHeader).forRoutes('*');
    consumer.apply(RequestTimeMiddleware).forRoutes('*');
  }
}
