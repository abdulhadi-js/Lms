import { IsString, IsOptional, IsUUID, IsInt, IsEnum, IsArray, ValidateNested, IsNotEmpty, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export enum ScheduleDays {
  MON = 'Monday',
  TUE = 'Tuesday',
  WED = 'Wednesday',
  THU = 'Thursday',
  FRI = 'Friday',
  SAT = 'Saturday',
  SUN = 'Sunday',
}

export enum ScheduleTime {
  SLOT_1 = '08:00 AM - 09:30 AM',
  SLOT_2 = '10:00 AM - 11:30 AM',
  SLOT_3 = '12:00 PM - 01:30 PM',
  SLOT_4 = '02:00 PM - 03:30 PM',
  SLOT_5 = '04:00 PM - 05:30 PM',
  SLOT_6 = '06:00 PM - 07:30 PM',
}

export class ScheduleSlotDto {
  @IsEnum(ScheduleDays)
  day: string;

  @IsEnum(ScheduleTime)
  time: string;
}

export class CreateCourseDto {
  @IsString()
  code: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  teacherId: string;

  @IsInt()
  @IsNotEmpty()
  credits: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ScheduleSlotDto)
  schedule: ScheduleSlotDto[];

  @IsString()
  @IsNotEmpty()
  room: string;
}
