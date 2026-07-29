import { IsUUID, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEnrollmentDto {
  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsUUID()
  @IsNotEmpty()
  sectionId: string;

  @IsString()
  @IsOptional()
  academicYear?: string;
}
