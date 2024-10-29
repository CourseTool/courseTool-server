import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { communityEntity } from '../../entities/community.entity';

@Module({
  imports: [TypeOrmModule.forFeature([communityEntity])],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}
