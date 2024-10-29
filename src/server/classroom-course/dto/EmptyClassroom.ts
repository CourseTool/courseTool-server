import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EmptyClassroomDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  week: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  section: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  weekDay: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  position: string;
}
