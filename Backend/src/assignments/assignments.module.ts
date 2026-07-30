import { RolesModule } from '../roles/roles.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { Assignment } from './entities/assignment.entity';
import { Submission } from './entities/submission.entity';

@Module({
  imports: [RolesModule, TypeOrmModule.forFeature([Assignment, Submission])],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
