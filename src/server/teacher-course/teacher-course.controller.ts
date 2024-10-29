import { Controller, Get, Query } from '@nestjs/common';
import { TeacherCourseService } from './teacher-course.service';
import { HasCourseWeekDayList } from './dto/HasCourseWeekDayList';
import { TeacherCourseFindOneDto } from './dto/TeacherCourseFindOneDto';
import { CalendarDto } from './dto/CalendarDto';
import { WeekDto } from './dto/WeekDto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('老师功能接口')
@Controller('teacher')
export class TeacherCourseController {
  constructor(private readonly teacherCourseService: TeacherCourseService) {}

  @Get('course')
  find(@Query() teacherCourseFindOneDto: TeacherCourseFindOneDto) {
    return this.teacherCourseService.find(teacherCourseFindOneDto);
  }

  @Get('hasCourseWeekDayList')
  hasCourseWeekDayList(@Query() HasCourseWeekDayListDTO: HasCourseWeekDayList) {
    return this.teacherCourseService.hasCourseWeekDayList(
      HasCourseWeekDayListDTO,
    );
  }

  @Get('calendar')
  calendar(@Query() calendarDto: CalendarDto) {
    return this.teacherCourseService.calendar(calendarDto);
  }

  @Get('week')
  weekCourse(@Query() weekDto: WeekDto) {
    return this.teacherCourseService.weekCourse(weekDto);
  }

  @Get('allTeacherList')
  allTeacherList() {
    return this.teacherCourseService.allTeacherList();
  }
}
