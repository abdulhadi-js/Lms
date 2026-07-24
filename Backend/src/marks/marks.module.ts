import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarksService } from './marks.service';
import { MarksController } from './marks.controller';
import { Mark } from './entities/mark.entity';
import { GradingCriteria } from './entities/grading-criteria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mark, GradingCriteria])],
  controllers: [MarksController],
  providers: [MarksService],
  exports: [MarksService]
})
export class MarksModule {}
