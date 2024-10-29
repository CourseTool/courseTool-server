import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TechCourseEntity } from '../../entities/tech_course.entity';
import { Repository } from 'typeorm';
import { RedisService } from '../../redis/redis.service';
import { Time } from '../../utils/Time';
import { HasCourseWeekDayList } from './dto/HasCourseWeekDayList';
import { TeacherCourseFindOneDto } from './dto/TeacherCourseFindOneDto';
import { CalendarDto } from './dto/CalendarDto';
import { WeekDto } from './dto/WeekDto';
import { TechListEntity } from '../../entities/tech_list.entity';

@Injectable()
export class TeacherCourseService {
  constructor(
    @InjectRepository(TechCourseEntity)
    private readonly techCourseMapper: Repository<TechCourseEntity>,
    @InjectRepository(TechListEntity)
    private readonly techListMapper: Repository<TechListEntity>,
    private readonly redisService: RedisService,
  ) {}

  async find(teacherCourseFindOneDto: TeacherCourseFindOneDto) {
    const queryData = {
      tech_name: teacherCourseFindOneDto.teacherName,
      week: teacherCourseFindOneDto.week,
      weekDay: teacherCourseFindOneDto.weekDay,
    };
    const courseData = (await this.techCourseMapper.findOneBy(queryData)) || [];
    const cacheKey = `${teacherCourseFindOneDto.teacherName}-${teacherCourseFindOneDto.week}-${teacherCourseFindOneDto.weekDay}`;
    const cacheData = await this.redisService.get(cacheKey);
    if (cacheData) {
      return cacheData;
    } else {
      await this.redisService.setex(cacheKey, Time.ONE_HOUR * 4, courseData);
      return courseData;
    }
  }

  async hasCourseWeekDayList(hasCourseWeekDayListDTO: HasCourseWeekDayList) {
    const result = await this.techCourseMapper
      .createQueryBuilder('tech_course')
      .select('tech_course.weekDay')
      .where('tech_name = :tech_name', {
        tech_name: hasCourseWeekDayListDTO.teacher,
      })
      .andWhere('week = :week', { week: hasCourseWeekDayListDTO.week })
      .andWhere('courseList != :courseList', { courseList: '{}' })
      .getMany();
    return result.map((item) => item.weekDay);
  }

  async calendar(calendarDto: CalendarDto) {
    calendarDto.weekList = JSON.parse('[' + calendarDto.weekList + ']');
    const result = await this.techCourseMapper
      .createQueryBuilder('tech_course')
      .where('week in :weekList', { weekList: calendarDto.weekList })
      .andWhere('tech_name = :teacherName', {
        teacherName: calendarDto.teacherName,
      })
      .getMany();
    result.forEach((item) => {
      item.courseList = JSON.parse(item.courseList);
    });
    return result;
  }

  async weekCourse(weekDto: WeekDto) {
    let courseList = await this.techCourseMapper.find({
      where: {
        tech_name: weekDto.teacherName,
        week: weekDto.week,
      },
    });
    const r = [];

    courseList.forEach((item) => {
      item.courseList = JSON.parse(item.courseList);
      r.push(...Object.values(item.courseList));
    });
    return r;
  }

  allTeacherList() {
    return this.techListMapper.find();
  }
}
