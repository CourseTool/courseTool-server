import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('advertisement')
export class AdvertisementEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  img_url: string;
}
