import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoversCourseDto {
  // 男生班级
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  maleClass: string;
  // 女生班级
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  femaleClass: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  week: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  weekDay: string;
}
