import {
  IsUUID,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { FeeStatus } from '../entities/fee.entity';

export class BulkGenerateDto {
  @IsString()
  courseId: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  dueDate: string;

  @IsString()
  title: string;
}

export class CreateFeeDto {
  @IsUUID()
  studentId: string;

  @IsOptional()
  @IsUUID()
  sectionId?: string;

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

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  lateFee?: number;

  @IsOptional()
  @IsDateString()
  holdUntil?: string;

  @IsOptional()
  installments?: any;
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
export class UpdateFeeDto extends PartialType(CreateFeeDto) {
  @IsOptional()
  @IsString()
  reason?: string;
}

export class DeleteFeeDto {
  @IsString()
  reason: string;
}
