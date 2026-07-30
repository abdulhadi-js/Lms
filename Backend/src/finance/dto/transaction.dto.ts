import {
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  category: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  date: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @IsOptional()
  @IsUUID()
  campusId?: string;
}

export class UpdateTransactionDto {
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDateString()
  date?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @IsOptional()
  @IsUUID()
  campusId?: string;
}
