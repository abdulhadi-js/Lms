import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  credits?: number;

  @IsString()
  @IsOptional()
  teacherId?: string;
}

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  credits?: number;

  @IsString()
  @IsOptional()
  teacherId?: string;
}

export class CreateCourseModuleDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateCourseLessonDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  contentType?: string;

  @IsString()
  @IsOptional()
  contentUrl?: string;
}
