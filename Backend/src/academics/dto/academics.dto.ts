import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateAcademicClassDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  level?: number;
}

export class UpdateAcademicClassDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  level?: number;
}

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  classId: string;
}

export class UpdateSectionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID()
  @IsOptional()
  classId?: string;
}

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsUUID()
  @IsNotEmpty()
  classId: string;
}

export class UpdateSubjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsUUID()
  @IsOptional()
  classId?: string;
}

export class AssignTeacherDto {
  @IsUUID()
  @IsNotEmpty()
  sectionId: string;

  @IsUUID()
  @IsNotEmpty()
  subjectId: string;

  @IsUUID()
  @IsNotEmpty()
  teacherId: string;
}
