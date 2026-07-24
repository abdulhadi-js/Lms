import { IsNumber, IsString, IsOptional } from 'class-validator';

export class GradingCriteriaDto {
  @IsNumber()
  minScore: number;

  @IsNumber()
  maxScore: number;

  @IsString()
  gradeLetter: string;

  @IsNumber()
  gpaPoints: number;

  @IsOptional()
  @IsString()
  description?: string;
}
