import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('classrooms_list')
export class ClassroomListEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  classroom: string;
}

