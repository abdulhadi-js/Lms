import { IsUUID, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateMarkDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  sectionId: string;

  @IsUUID()
  subjectId: string;

  @IsString()
  component: string;

  @IsNumber()
  score: number;

  @IsNumber()
  maxScore: number;

  @IsNumber()
  weightPercent: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
