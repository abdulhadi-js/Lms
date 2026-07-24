import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  applicantEmail: string;

  @IsString()
  phone: string;

  @IsString()
  desiredCourse: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
