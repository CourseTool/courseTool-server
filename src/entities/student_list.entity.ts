import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('student_list')
export class Student_listEntity {
  @PrimaryColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  sex: string;
  @Column()
  class: string;
  @Column()
  speciality: string;
  @Column()
  phone: string;
  @Column()
  dorm_weight: number;
  @Column()
  weight_detail: string;
  @Column()
  has_dorm: number;
  @Column()
  career: string;
  @Column()
  holland: string;
}
