import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('class_list')
export class ClassListEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  className: string;
}

