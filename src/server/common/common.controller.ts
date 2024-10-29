import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommonService } from './common.service';
import { ApiTags } from '@nestjs/swagger';
import { DormAnswerData } from './dto/DormAnswerData';

@ApiTags('公共接口')
@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('update-log')
  updateLog() {
    return this.commonService.updateLog();
  }

  @Get('message')
  message() {
    return this.commonService.message();
  }

  @Get('newborn-aq')
  newbornAq() {
    return this.commonService.newbornAq();
  }

  @Get('dorm-question')
  dormQuestion() {
    return this.commonService.dormQuestion();
  }

  @Post('dorm-allocation')
  dormAllocation(@Body() answerData: DormAnswerData) {
    return this.commonService.dormAllocation(answerData);
  }

  @Get('new-student-list')
  newStudentList() {
    return this.commonService.getNewStudentList();
  }

  @Post('career')
  career(@Body() careerData: any) {
    return this.commonService.career(careerData);
  }

  @Post('holland')
  holland(@Body() hollandData: any) {
    return this.commonService.holland(hollandData);
  }

  @Get('config')
  config() {
    return this.commonService.config();
  }

  @Get('advertisement')
  advertisement() {
    return true;
  }

  @Get('advertisement-img')
  advertisementImg() {
    return this.commonService.advertisementImg();
  }
}
