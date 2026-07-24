import { IsString, IsOptional, IsUUID, IsInt } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  code: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  teacherId?: string;

  @IsOptional()
  @IsInt()
  credits?: number = 3;
}
