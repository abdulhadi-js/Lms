import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from '../roles/roles.module';
import { AcademicGroupsService } from './academic-groups.service';
import { AcademicGroupsController } from './academic-groups.controller';
import { AcademicGroup } from './entities/academic-group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AcademicGroup]),
    RolesModule,
  ],
  controllers: [AcademicGroupsController],
  providers: [AcademicGroupsService],
})
export class AcademicGroupsModule {}
