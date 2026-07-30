import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsObject,
} from 'class-validator';

export class UpdateStaffProfileDto {
  @IsOptional()
  @IsString()
  qualifications?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsDateString()
  appointmentDate?: Date;

  @IsOptional()
  @IsNumber()
  basicSalary?: number;

  @IsOptional()
  @IsObject()
  allowances?: any;

  @IsOptional()
  @IsObject()
  deductions?: any;

  @IsOptional()
  @IsString()
  bankAccountDetails?: string;
}
