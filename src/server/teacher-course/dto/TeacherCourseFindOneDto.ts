import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TeacherCourseFindOneDto {
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
  teacherName: string;
}
