import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class RequestDropDto {
  @IsUUID()
  @IsNotEmpty()
  enrollmentId: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
