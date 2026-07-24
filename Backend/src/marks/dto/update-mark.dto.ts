import { PartialType } from '@nestjs/mapped-types';
import { CreateMarkDto } from './create-mark.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateMarkDto extends PartialType(CreateMarkDto) {
  @IsString()
  @IsOptional()
  overrideReason?: string;
}
