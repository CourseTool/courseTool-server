import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('newborn_aq')
export class NewbornAqEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  content: string;
}
