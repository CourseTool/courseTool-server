import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassroomListEntity } from '../../entities/classroom-list.entity';
import { ClassroomCourseFindOneDto } from './dto/classroomCourseFindOneDto';
import { In, Repository } from 'typeorm';
import { TechCourseEntity } from '../../entities/tech_course.entity';
import { HasCourseWeekDayList } from './dto/HasCourseWeekDayList';
import { CalendarDto } from './dto/CalendarDto';
import { EmptyClassroomDto } from './dto/EmptyClassroom';
import { ClassroomCourseEntity } from 'src/entities/classroomCourse.entity';

@Injectable()
export class ClassroomCourseService {
  constructor(
    @InjectRepository(ClassroomListEntity)
    private classroomListMapper: Repository<ClassroomListEntity>,
    @InjectRepository(ClassroomCourseEntity)
    private classroomCourseMapper: Repository<ClassroomCourseEntity>,
  ) { }

  find(classroomCourseFindOneDto: ClassroomCourseFindOneDto) {
    const { classroom, week, weekDay } = classroomCourseFindOneDto;
    return this.classroomCourseMapper.findOne({
      where: {
        coursePosition: classroom,
        week: week,
        weekDay: weekDay,
      },
    });
  }

  async hasCourseWeekDayList(hasCourseWeekDayListDTO: HasCourseWeekDayList) {
    const { classroom, week } = hasCourseWeekDayListDTO;
    let result: ClassroomCourseEntity[] = await this.classroomCourseMapper.find({
      where: {
        coursePosition: classroom,
        week: week,
      },
    });
    return result.filter((item) => item.courseList !== "{}").map(d => d.weekDay);
  }

  allClassList() {
    return this.classroomListMapper.find();
  }

  async calendar(calendarDto: CalendarDto) {
    let { classroom, weekList } = calendarDto;
    let result: ClassroomCourseEntity[] = await this.classroomCourseMapper.find({
      where: {
        coursePosition: classroom,
        week: In(JSON.parse(weekList)),
      }
    });
    result = result.filter(d => d.courseList !== '{}');
    result.forEach(d => d.courseList = JSON.parse(d.courseList));
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

