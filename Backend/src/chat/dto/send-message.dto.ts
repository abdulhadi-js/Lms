import { IsUUID, IsString, MaxLength, IsOptional } from 'class-validator';

export class SendMessageDto {
  @IsOptional()
  @IsUUID()
  receiverId?: string;

  @IsOptional()
  @IsUUID()
  courseId?: string;

  @IsString()
  @MaxLength(5000)
  body: string;
}
