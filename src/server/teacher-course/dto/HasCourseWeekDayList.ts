import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HasCourseWeekDayList {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  teacher: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  week: string;
}
