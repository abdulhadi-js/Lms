import { IsString, IsOptional, IsInt, IsUrl, IsEnum } from 'class-validator';

export enum ContentType {
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  QUIZ = 'QUIZ',
}

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ContentType)
  contentType: ContentType;

  @IsOptional()
  @IsUrl()
  contentUrl?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsInt()
  duration?: number;
}
