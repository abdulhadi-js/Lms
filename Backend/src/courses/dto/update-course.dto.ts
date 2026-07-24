import { PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';
import { IsOptional, IsEnum } from 'class-validator';

export enum CourseStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;
}
