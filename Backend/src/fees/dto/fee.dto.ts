import {
  IsUUID,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { FeeStatus } from '../entities/fee.entity';

export class CreateFeeDto {
  @IsUUID()
  studentId: string;

  @IsOptional()
  @IsUUID()
  courseId?: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsEnum(FeeStatus)
  status?: FeeStatus;
}

export class PayFeeDto {
  @IsNumber()
  paidAmount: number;
}

export class RefundFeeDto {
  @IsString()
  refundReason: string;
}

import { PartialType } from '@nestjs/mapped-types';
export class UpdateFeeDto extends PartialType(CreateFeeDto) {}
