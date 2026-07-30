import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './entities/role.entity';

import { ModulePermission } from './entities/module-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, ModulePermission])],
  providers: [RolesService],
  controllers: [RolesController],
  exports: [RolesService, TypeOrmModule],
})
export class RolesModule {}
