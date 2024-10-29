import { Controller, Get, Query } from '@nestjs/common';
import { CommunityService } from './community.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('社区功能接口')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('type')
  getListByType(@Query('type') type: string) {
    return this.communityService.getListByType(type);
  }
}
