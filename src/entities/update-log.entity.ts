import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('update_log')
export class UpdateLogEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn()
  @Column()
  updateTime: string;

  @Column()
  updateAuthor: string;
}
