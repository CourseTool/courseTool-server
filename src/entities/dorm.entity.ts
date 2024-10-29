import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('dorm')
export class DormEntity {
  @PrimaryColumn()
  id: number;
  @Column()
  student_id: string;
  @Column()
  weight_total: number;
  @Column()
  weight_average: number;
  @Column()
  class: string;
  @Column()
  student_count: number;
}
