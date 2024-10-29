import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { StudentCourseEntity } from '../entities/student-course.entity';

interface Response<T> {
  data: StudentCourseEntity | { courseList: any[] };
}

function isCourseList(data: StudentCourseEntity): boolean {
  return Object.keys(data).includes('courseList');
}

function parserCourseList(data: StudentCourseEntity, url: string) {
  if (data == null) {
    if (url.includes('student') || url.includes('teacher')) {
      return {
        code: 200,
        message: '请求成功',
        data: { courseList: [] },
      };
    }
  }

  if (isCourseList(data)) {
    if (data.courseList === '{}') {
      return {
        code: 200,
        message: '请求成功',
        data: { courseList: [] },
      };
    } else {
      data.courseList = JSON.parse(data.courseList);
      return {
        code: 200,
        message: '请求成功',
        data: data,
      };
    }
  }

  return {
    code: 200,
    message: '请求成功',
    data: data,
  };
}

@Injectable()
export class ResponseInterceptor<T>
  implements
    NestInterceptor<StudentCourseEntity, Response<StudentCourseEntity>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<StudentCourseEntity>,
  ): Observable<Response<StudentCourseEntity>> {
    return next.handle().pipe(
      map((data) => {
        // 将课程列表JSON转换为数组
        const url = context.getArgs()[1].req.url;
        return parserCourseList(data, url);
      }),
    );
  }
}
