import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HasCourseWeekDayList {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  className: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  week: string;
}
