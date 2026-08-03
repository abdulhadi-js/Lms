import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CampusesService } from './campuses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../auth/guards/matrix.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ModuleId } from '../roles/entities/module-permission.entity';

@Controller('public/campuses')
export class PublicCampusesController {
  constructor(private readonly campusesService: CampusesService) {}

  @Get()
  findPublic() {
    // Only return active campuses with minimal info
    return this.campusesService.findPublic();
  }
}

@Controller('campuses')
@UseGuards(JwtAuthGuard, MatrixGuard)
export class CampusesController {
  constructor(private readonly campusesService: CampusesService) {}

  @Post()
  @RequirePermission(ModuleId.CAMPUSES, 'ADD')
  create(@Body() data: any, @Request() req: any) {
    return this.campusesService.create(data, req.user);
  }

  @Get()
  @RequirePermission(ModuleId.CAMPUSES, 'VIEW')
  findAll(@Request() req: any) {
    return this.campusesService.findAll(req.user);
  }

  @Get(':id')
  @RequirePermission(ModuleId.CAMPUSES, 'VIEW')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.campusesService.findOne(id, req.user);
  }

  @Patch(':id')
  @RequirePermission(ModuleId.CAMPUSES, 'EDIT')
  update(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    return this.campusesService.update(id, data, req.user);
  }

  @Delete(':id')
  @RequirePermission(ModuleId.CAMPUSES, 'DELETE')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.campusesService.remove(id, req.user);
  }
}
