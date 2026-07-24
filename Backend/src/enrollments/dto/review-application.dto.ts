import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum ApplicationStatus {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class ReviewApplicationDto {
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
