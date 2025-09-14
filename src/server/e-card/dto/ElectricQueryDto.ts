import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ElectivesQueryDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  dormId: string;
}
