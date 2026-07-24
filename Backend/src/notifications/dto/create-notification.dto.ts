import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  audienceRole?: string;

  @IsOptional()
  @IsUUID()
  courseId?: string;
}
