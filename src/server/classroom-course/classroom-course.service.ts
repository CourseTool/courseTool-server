import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassroomListEntity } from '../../entities/classroom-list.entity';
import { ClassroomCourseFindOneDto } from './dto/classroomCourseFindOneDto';
import { Repository } from 'typeorm';
import { TechCourseEntity } from '../../entities/tech_course.entity';
import { HasCourseWeekDayList } from './dto/HasCourseWeekDayList';
import { CalendarDto } from './dto/CalendarDto';
import { EmptyClassroomDto } from './dto/EmptyClassroom';

@Injectable()
export class ClassroomCourseService {
  constructor(
    @InjectRepository(ClassroomListEntity)
    private classroomListMapper: Repository<ClassroomListEntity>,
    @InjectRepository(TechCourseEntity)
    private techCourseMapper: Repository<TechCourseEntity>,
  ) {}

  find(classroomCourseFindOneDto: ClassroomCourseFindOneDto) {
    const { classroom, week, weekDay } = classroomCourseFindOneDto;
    const sqlStr = `select
                            c.id,
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
                                ) j where j.coursePosition = '${classroom}' and c.week = '${week}' and c.weekDay = '${weekDay}'`;
    return this.techCourseMapper.query(sqlStr);
  }

  async hasCourseWeekDayList(hasCourseWeekDayListDTO: HasCourseWeekDayList) {
    const { classroom, week } = hasCourseWeekDayListDTO;
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
                                ) j where j.coursePosition = '${classroom}' and c.week = '${week}'`;
    let result: any[] = await this.techCourseMapper.query(sqlStr);
    return [...new Set(result.map((item) => item.courseWeekDay))];
  }

  allClassList() {
    return this.classroomListMapper.find();
  }

  async calendar(calendarDto: CalendarDto) {
    let { classroom, weekList } = calendarDto;
    const jsWeekList =
      '(' +
      JSON.parse(weekList)
        .map((item: any) => `'${item}'`)
        .join(',') +
      ')';
    console.log('jsWeekList', jsWeekList);
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
                                ) j where j.coursePosition = '${classroom}' and c.week in ${jsWeekList}`;
    const result: any[] = await this.techCourseMapper.query(sqlStr);
    return result;
  }

  async emptyClassroom(emptyClassroomDto: EmptyClassroomDto) {
    const { section, week, weekDay, position } = emptyClassroomDto;
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
                                ) j where j.courseSection = '${section}' and c.week = '${week}' and j.courseWeekDay = '${weekDay}'`;
    let data = await this.classroomListMapper.query(sqlStr);
    data = data
      .map((d) => {
        if (position === '南苑') {
          if (d.coursePosition.includes('25')) {
            return d.coursePosition;
          }
        } else {
          if (!d.coursePosition.includes('25')) {
            return d.coursePosition;
          }
        }
      })
      .filter(Boolean);
    let allClassroomList = await this.allClassList();
    const allClassroomList2 = allClassroomList
      .map((d) => {
        if (position === '南苑') {
          if (d.classroom.includes('25')) {
            return d.classroom;
          }
        } else {
          if (!d.classroom.includes('25')) {
            return d.classroom;
          }
        }
      })
      .filter(Boolean);
    data = allClassroomList2.filter((d) => !data.includes(d));
    return data;
  }
}
