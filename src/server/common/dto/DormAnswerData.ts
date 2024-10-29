import { IsNotEmpty, IsString } from 'class-validator';

export class DormAnswerData {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  student_id: number;
}
