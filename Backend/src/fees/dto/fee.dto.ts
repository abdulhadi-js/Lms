import {
  IsUUID,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

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
}

export class PayFeeDto {
  @IsNumber()
  paidAmount: number;
}

export class RefundFeeDto {
  @IsString()
  refundReason: string;
}
