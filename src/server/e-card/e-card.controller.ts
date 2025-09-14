import { Controller, Get, Query } from '@nestjs/common';
import { StudentCourseService } from './e-card.service';
import { ApiTags } from '@nestjs/swagger';
import { ElectivesQueryDto } from './dto/ElectricQueryDto';

@ApiTags('一卡通功能接口')
@Controller('ecard')
export class ECardController {
  constructor(private readonly studentCourseService: StudentCourseService) {}

  @Get('electric')
  async electric(@Query() electivesQuery: ElectivesQueryDto) {
    return await this.studentCourseService.electric(electivesQuery);
  }
}
