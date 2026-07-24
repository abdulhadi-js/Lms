import { IsNumber, IsString } from 'class-validator';

export class GradeSubmissionDto {
  @IsNumber()
  grade: number;

  @IsString()
  feedback: string;
}
