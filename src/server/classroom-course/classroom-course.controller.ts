import { Controller, Get, Query } from '@nestjs/common';
import { ClassroomCourseService } from './classroom-course.service';
import { ClassroomCourseFindOneDto } from './dto/classroomCourseFindOneDto';
import { HasCourseWeekDayList } from './dto/HasCourseWeekDayList';
import { ApiTags } from '@nestjs/swagger';
import { CalendarDto } from './dto/CalendarDto';
import { EmptyClassroomDto } from './dto/EmptyClassroom';

@ApiTags('教室功能接口')
@Controller('classroom')
export class ClassroomCourseController {
  constructor(
    private readonly classroomCourseService: ClassroomCourseService,
  ) {}

  @Get('course')
  find(@Query() classroomCourseFindOneDto: ClassroomCourseFindOneDto) {
    return this.classroomCourseService.find(classroomCourseFindOneDto);
  }

  @Get('hasCourseWeekDayList')
  hasCourseWeekDayList(@Query() hasCourseWeekDayListDTO: HasCourseWeekDayList) {
    return this.classroomCourseService.hasCourseWeekDayList(
      hasCourseWeekDayListDTO,
    );
  }

  @Get('list')
  allClassroom() {
    return this.classroomCourseService.allClassList();
  }

  @Get('/calendar')
  calendar(@Query() calendarDto: CalendarDto) {
    return this.classroomCourseService.calendar(calendarDto);
  }

  @Get('/empty-classroom')
  emptyClassroom(@Query() emptyClassroomDto: EmptyClassroomDto) {
    return this.classroomCourseService.emptyClassroom(emptyClassroomDto);
  }
}
