import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('classroom_course')
export class ClassroomCourseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  coursePosition: string;
  @Column()
  week: string;
  @Column()
  weekDay: string;
  @Column()
  courseList: string;
}
