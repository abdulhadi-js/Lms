import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarksService } from './marks.service';
import { MarksController } from './marks.controller';
import { Mark } from './entities/mark.entity';
import { GradingCriteria } from './entities/grading-criteria.entity';
import { UsersModule } from '../users/users.module';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mark, GradingCriteria]),
    UsersModule,
    CoursesModule,
  ],
  controllers: [MarksController],
  providers: [MarksService],
  exports: [MarksService],
})
export class MarksModule {}
