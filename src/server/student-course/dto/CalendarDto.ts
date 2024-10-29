import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalendarDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  className: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  weekList: string;
}
