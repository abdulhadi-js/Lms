import { IsUUID, IsEnum, Matches, IsString, IsOptional } from 'class-validator';

export class CreateTimetableDto {
  @IsUUID()
  sectionId: string;

  @IsUUID()
  subjectId: string;

  @IsUUID()
  @IsOptional()
  teacherId?: string;

  @IsEnum(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'])
  dayOfWeek: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in HH:mm format',
  })
  startTime: string;

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in HH:mm format',
  })
  endTime: string;

  @IsString()
  room: string;
}
