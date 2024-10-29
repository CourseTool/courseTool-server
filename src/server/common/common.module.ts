import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateLogEntity } from '../../entities/update-log.entity';
import { NewbornAqEntity } from '../../entities/newbornAq.entity';
import { DormEntity } from '../../entities/dorm.entity';
import { Student_listEntity } from '../../entities/student_list.entity';
import { AdvertisementEntity } from '../../entities/advertisement.entity';
import { RedisService } from '../../redis/redis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdvertisementEntity,
      UpdateLogEntity,
      NewbornAqEntity,
      DormEntity,
      Student_listEntity,
    ]),
  ],
  controllers: [CommonController],
  providers: [CommonService, RedisService],
})
export class CommonModule {}
