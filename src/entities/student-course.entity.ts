import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

