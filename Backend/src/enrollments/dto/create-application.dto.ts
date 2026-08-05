import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsUUID,
  IsDate,
} from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  studentFirstName: string;

  @IsString()
  @IsNotEmpty()
  studentLastName: string;

  @IsDate()
  @IsOptional()
  dob?: Date;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsNotEmpty()
  fatherName: string;

  @IsString()
  @IsNotEmpty()
  fatherCnic: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  previousSchool?: string;

  @IsUUID()
  @IsNotEmpty()
  desiredClassId: string;

  @IsUUID()
  @IsNotEmpty()
  campusId: string;
}
