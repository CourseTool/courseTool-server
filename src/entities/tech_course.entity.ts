import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tech_course')
export class TechCourseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  tech_name: string;
  @Column()
  week: string;
  @Column()
  weekDay: string;
  @Column()
  courseList: string;
}

