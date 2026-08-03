import { RolesModule } from '../roles/roles.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicsService } from './academics.service';
import { AcademicsController, PublicAcademicsController } from './academics.controller';
import { AcademicClass } from './entities/academic-class.entity';
import { Section } from './entities/section.entity';
import { Subject } from './entities/subject.entity';
import { TeacherAssignment } from './entities/teacher-assignment.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [RolesModule, 
    TypeOrmModule.forFeature([
      AcademicClass,
      Section,
      Subject,
      TeacherAssignment,
      User,
    ]),
  ],
  controllers: [AcademicsController, PublicAcademicsController],
  providers: [AcademicsService],
  exports: [AcademicsService],
})
export class AcademicsModule {}
