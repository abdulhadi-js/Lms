import { RolesModule } from '../roles/roles.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarksService } from './marks.service';
import { MarksController } from './marks.controller';
import { Mark } from './entities/mark.entity';
import { GradingCriteria } from './entities/grading-criteria.entity';
import { UsersModule } from '../users/users.module';
import { AcademicsModule } from '../academics/academics.module';

@Module({
  imports: [RolesModule, 
    TypeOrmModule.forFeature([Mark, GradingCriteria]),
    UsersModule,
    AcademicsModule,
  ],
  controllers: [MarksController],
  providers: [MarksService],
  exports: [MarksService],
})
export class MarksModule {}
