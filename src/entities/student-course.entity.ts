import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface CourseList {
  courseName: string;
  courseClass: string;
  courseTeacher: string;
  courseWeek: string;
  coursePosition: string;
  courseSection: string;
  courseWeekDay: string;
}

@Entity('class_course')
export class StudentCourseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  className: string;
  @Column()
  week: string;
  @Column()
  weekDay: string;
  @Column()
  courseList: string;
}

