import { RolesModule } from '../roles/roles.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeesService } from './fees.service';
import { FeesController } from './fees.controller';
import { Fee } from './entities/fee.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Family } from '../families/entities/family.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [RolesModule, TypeOrmModule.forFeature([Fee, Enrollment, Family]), AuditModule],
  controllers: [FeesController],
  providers: [FeesService],
  exports: [FeesService],
})
export class FeesModule {}
