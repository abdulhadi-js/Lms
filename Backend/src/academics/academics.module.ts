import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicsService } from './academics.service';
import { AcademicsController } from './academics.controller';
import { AcademicClass } from './entities/academic-class.entity';
import { Section } from './entities/section.entity';
import { Subject } from './entities/subject.entity';
import { TeacherAssignment } from './entities/teacher-assignment.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AcademicClass,
      Section,
      Subject,
      TeacherAssignment,
      User
    ])
  ],
  controllers: [AcademicsController],
  providers: [AcademicsService],
  exports: [AcademicsService]
})
export class AcademicsModule {}
