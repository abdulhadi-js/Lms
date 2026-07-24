import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';

export enum DropType {
  COURSE = 'COURSE',
  FULL = 'FULL',
}

export class RequestDropDto {
  @IsString()
  reason: string;

  @IsEnum(DropType)
  dropType: DropType;

  @IsOptional()
  @IsUUID()
  courseId?: string;
}
