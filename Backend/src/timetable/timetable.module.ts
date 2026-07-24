import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimetableService } from './timetable.service';
import { TimetableController } from './timetable.controller';
import { Timetable } from './entities/timetable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Timetable])],
  controllers: [TimetableController],
  providers: [TimetableService],
  exports: [TimetableService]
})
export class TimetableModule {}
