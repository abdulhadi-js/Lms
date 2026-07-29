import { IsString, IsOptional, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsString()
  body: string;

  @IsOptional()
  @IsUUID()
  receiverId?: string;

  @IsOptional()
  @IsUUID()
  sectionId?: string;
}
