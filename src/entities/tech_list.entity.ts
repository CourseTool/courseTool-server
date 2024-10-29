import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tech_list')
export class TechListEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  tech_name: string;
}
