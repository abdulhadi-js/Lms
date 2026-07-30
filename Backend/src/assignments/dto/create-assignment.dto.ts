import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  IsUUID,
  IsArray,
} from 'class-validator';

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
  @IsNotEmpty()
  sectionId: string;

  @IsUUID()
  @IsNotEmpty()
  subjectId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsArray()
  rubric?: RubricDto[];

  @IsNumber()
  maxMarks: number;

  @IsDateString()
  dueDate: Date;

  @IsNumber()
  @IsOptional()
  weightPercent?: number;
}
