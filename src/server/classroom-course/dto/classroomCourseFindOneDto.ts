import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ClassroomCourseFindOneDto {
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
  classroom: string;
}
