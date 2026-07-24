import { IsUUID, IsString, IsOptional, IsNumber, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class RubricDto {
  @IsString()
  criterion: string;

  @IsString()
  description: string;

  @IsNumber()
  maxPoints: number;
}

export class CreateAssignmentDto {
  @IsUUID()
  courseId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  rubric?: RubricDto[];

  @IsNumber()
  maxMarks: number;

  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @IsOptional()
  @IsNumber()
  weightPercent?: number;
}
