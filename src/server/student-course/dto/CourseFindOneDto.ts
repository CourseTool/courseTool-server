import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CourseFindOneDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  week: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  weekDay: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  className: string;
}
