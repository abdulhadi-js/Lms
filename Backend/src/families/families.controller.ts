import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ModuleId } from '../roles/entities/module-permission.entity';

@UseGuards(JwtAuthGuard)
@Controller('families')
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Get()
  @RequirePermission(ModuleId.USERS_STUDENTS, 'VIEW')
  async findAll(@Query('familyCode') familyCode?: string) {
    return this.familiesService.findAll(familyCode);
  }

  @Get(':id')
  @RequirePermission(ModuleId.USERS_STUDENTS, 'VIEW')
  async findOne(@Param('id') id: string) {
    return this.familiesService.findOne(id);
  }
}
