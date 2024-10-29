import { Controller, Get, Query } from '@nestjs/common';
import { StudentCourseService } from './student-course.service';
import { CourseFindOneDto } from './dto/CourseFindOneDto';
import { HasCourseWeekDayList } from './dto/HasCourseWeekDayList';
import { CalendarDto } from './dto/CalendarDto';
import { LoversCourseDto } from './dto/LoversCourseDto';
import { WeekDto } from './dto/WeekDto';
import { ApiTags } from '@nestjs/swagger';
import { ElectivesDto } from './dto/ElectivesDto';

@ApiTags('学生功能接口')
@Controller('student')
export class StudentCourseController {
  constructor(private readonly studentCourseService: StudentCourseService) {}

  @Get('course')
  find(@Query() courseFindOneDTO: CourseFindOneDto) {
    return this.studentCourseService.find(courseFindOneDTO);
  }

  @Get('hasCourseWeekDayList')
  hasCourseWeekDayList(@Query() HasCourseWeekDayListDTO: HasCourseWeekDayList) {
    return this.studentCourseService.hasCourseWeekDayList(
      HasCourseWeekDayListDTO,
    );
  }

  @Get('allClass')
  allClassroom() {
    return this.studentCourseService.allClassList();
  }

  @Get('calendar')
  calendar(@Query() calendarDto: CalendarDto) {
    return this.studentCourseService.calendar(calendarDto);
  }

  @Get('lovers')
  loversCourse(@Query() loversCourseDto: LoversCourseDto) {
    return this.studentCourseService.loversCourse(loversCourseDto);
  }

  @Get('week')
  weekCourse(@Query() weekDto: WeekDto) {
    return this.studentCourseService.weekCourse(weekDto);
  }

  @Get('electives')
  electivesCourse(@Query() electivesDto: ElectivesDto) {
    return this.studentCourseService.electivesCourse(electivesDto);
  }
}
