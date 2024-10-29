import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class HasCourseWeekDayList {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  classroom: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  week: string;
}
