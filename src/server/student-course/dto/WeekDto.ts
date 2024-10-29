import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WeekDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  week: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  className: string;
}
