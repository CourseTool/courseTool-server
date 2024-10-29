import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ElectivesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  teacher: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  section: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  classroom: string;
}
