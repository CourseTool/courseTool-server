import { Injectable } from '@nestjs/common';
import { CourseFindOneDto } from './dto/CourseFindOneDto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentCourseEntity } from '../../entities/student-course.entity';
import { Repository } from 'typeorm';
import { RedisService } from '../../redis/redis.service';
import { Time } from '../../utils/Time';
import { HasCourseWeekDayList } from './dto/HasCourseWeekDayList';
import { ClassListEntity } from '../../entities/class-list.entity';
import { CalendarDto } from './dto/CalendarDto';
import { LoversCourseDto } from './dto/LoversCourseDto';
import { WeekDto } from './dto/WeekDto';
import { ElectivesDto } from './dto/ElectivesDto';
import { TechCourseEntity } from '../../entities/tech_course.entity';

@Injectable()
export class StudentCourseService {
  constructor(
    @InjectRepository(StudentCourseEntity)
    private readonly studentCourseMapper: Repository<StudentCourseEntity>,
    @InjectRepository(ClassListEntity)
    private readonly classListMapper: Repository<ClassListEntity>,
    @InjectRepository(TechCourseEntity)
    private readonly techCourseMapper: Repository<TechCourseEntity>,
    private readonly redisService: RedisService,
  ) {}

  async find(courseFindOneDTO: CourseFindOneDto) {
    const cacheKey = `${courseFindOneDTO.className}-${courseFindOneDTO.week}-${courseFindOneDTO.weekDay}`;
    const cacheData = await this.redisService.get(cacheKey);
    if (cacheData) return cacheData;
    const courseData =
      await this.studentCourseMapper.findOneBy(courseFindOneDTO);
    this.redisService.setex(cacheKey, Time.ONE_HOUR * 4, courseData);
    return courseData;
  }

  async hasCourseWeekDayList(hasCourseWeekDayListDTO: HasCourseWeekDayList) {
    console.log(111, hasCourseWeekDayListDTO);
    const result = await this.studentCourseMapper
      .createQueryBuilder('class_course')
      .select('class_course.*')
      // .where('className = :className', {
      //   className: hasCourseWeekDayListDTO.className,
      // })
      // .andWhere('week = :week', { week: hasCourseWeekDayListDTO.week })
      // .andWhere('courseList != :courseList', { courseList: '{}' })
      .getMany();
    console.log(result);
    return result.map((item) => item.weekDay);
  }

  allClassroom() {
    return this.studentCourseMapper
      .createQueryBuilder('class_course')
      .select('class_course.className');
  }

  allClassList() {
    return this.classListMapper.find();
  }

  async calendar(calendarDto: CalendarDto) {
    calendarDto.weekList = JSON.parse('[' + calendarDto.weekList + ']');
    const result = await this.studentCourseMapper
      .createQueryBuilder('class_course')
      .where('week in :weekList', { weekList: calendarDto.weekList })
      .andWhere('className = :className', { className: calendarDto.className })
      .getMany();
    result.forEach((item) => {
      item.courseList = JSON.parse(item.courseList);
    });
    return result;
  }

  async loversCourse(loversCourseDto: LoversCourseDto) {
    const { femaleClass, maleClass, week, weekDay } = loversCourseDto;
    const classList = `('${femaleClass}','${maleClass}')`;
    const sqlStr = `select * from class_course where className in ${classList} and week = '${week}' and weekDay = '${weekDay}'`;
    const data: StudentCourseEntity[] =
      await this.studentCourseMapper.query(sqlStr);
    data.forEach((d) => {
      d.courseList = JSON.parse(d.courseList);
    });
    const r = {};
    data.forEach((d) => {
      Object.keys(d.courseList).forEach((s) => {
        if (!(s in r)) {
          r[s] = [];
        }
        r[s].push(d.courseList[s]);
      });
    });
    return r;
  }

  async weekCourse(weekDto: WeekDto) {
    let courseList = await this.studentCourseMapper.find({
      where: {
        className: weekDto.className,
        week: weekDto.week,
      },
    });
    courseList = courseList.map((item) => {
      item.courseList = JSON.parse(item.courseList);
      return item;
    });
    return courseList;
  }

  async electivesCourse(electivesDto: ElectivesDto) {
    const { classroom, section, teacher } = electivesDto;
    const sqlStr = `select
                            c.id,
                            c.week,
                            j.courseSection,
                            j.courseTeacher,
                            j.courseName,
                            j.courseClass,
                            j.courseWeek,
                            j.coursePosition,
                            j.courseWeekDay
                            from
                            tech_course c
                            cross join json_table(
                                c.courseList,
                                "$.*" columns(
                                    courseSection varchar(50) path "$.courseSection",
                                    courseTeacher VARCHAR(50) PATH "$.courseTeacher",
                                    courseName VARCHAR(255) PATH "$.courseName",
                                    courseClass VARCHAR(255) PATH "$.courseClass",
                                    courseWeek VARCHAR(50) PATH "$.courseWeek",
                                    coursePosition VARCHAR(255) PATH "$.coursePosition",
                                    courseWeekDay VARCHAR(50) PATH "$.courseWeekDay"
                                    )
                                ) j where c.tech_name = '${teacher}' and j.coursePosition = '${classroom}' and j.courseSection = '${section}'`;

    return await this.techCourseMapper.query(sqlStr);
  }
}
