import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  order?: number;
}
