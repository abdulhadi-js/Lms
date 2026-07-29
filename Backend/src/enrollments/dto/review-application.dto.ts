import { IsString, IsOptional, IsIn, IsNumber, IsDateString, IsUUID } from 'class-validator';

export class ReviewApplicationDto {
  @IsIn(['PENDING', 'TEST_SCHEDULED', 'APPROVED_WAITING_FEE', 'ENROLLED', 'REJECTED'])
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  testDate?: Date;

  @IsNumber()
  @IsOptional()
  testMarks?: number;

  @IsString()
  @IsOptional()
  reviewNotes?: string;

  @IsUUID()
  @IsOptional()
  sectionId?: string; // provided when changing to ENROLLED
}
