import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('community')
export class communityEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  position: string;
  @Column()
  push_name: string;
  @Column()
  pic: string;
  @Column()
  type: string;
  @Column()
  content: string;
  @Column()
  img_list: string;
  @Column()
  view_count: string;
  @CreateDateColumn({
    asExpression: 'yyyy-MM-DD',
  })
  @Column()
  created_time: string;
}
