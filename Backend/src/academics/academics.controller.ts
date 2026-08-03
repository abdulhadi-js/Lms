import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AcademicsService } from './academics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../auth/guards/matrix.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ModuleId } from '../roles/entities/module-permission.entity';
import {
  CreateAcademicClassDto,
  UpdateAcademicClassDto,
  CreateSectionDto,
  UpdateSectionDto,
  CreateSubjectDto,
  UpdateSubjectDto,
  AssignTeacherDto,
} from './dto/academics.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('public')
export class PublicAcademicsController {
  constructor(private readonly academicsService: AcademicsService) {}

  @Get('classes')
  findPublicClasses() {
    return this.academicsService.findPublicClasses();
  }
}

@Controller('academics')
@UseGuards(JwtAuthGuard, MatrixGuard)
export class AcademicsController {
  constructor(private readonly academicsService: AcademicsService) {}

  @RequirePermission(ModuleId.ACADEMICS, 'ADD')
  @Post('classes')
  createClass(@Body() dto: CreateAcademicClassDto, @CurrentUser() user: any) {
    return this.academicsService.createClass(dto, user);
  }

  @Get('classes')
  findAllClasses(@CurrentUser() user: any) {
    return this.academicsService.findAllClasses(user);
  }

  @Get('classes/:id')
  findClassById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.academicsService.findClassById(id, user);
  }

  @RequirePermission(ModuleId.ACADEMICS, 'EDIT')
  @Put('classes/:id')
  updateClass(
    @Param('id') id: string,
    @Body() dto: UpdateAcademicClassDto,
    @CurrentUser() user: any,
  ) {
    return this.academicsService.updateClass(id, dto, user);
  }

  @RequirePermission(ModuleId.ACADEMICS, 'DELETE')
  @Delete('classes/:id')
  removeClass(@Param('id') id: string, @CurrentUser() user: any) {
    return this.academicsService.removeClass(id, user);
  }

  @RequirePermission(ModuleId.ACADEMICS, 'ADD')
  @Post('sections')
  createSection(@Body() dto: CreateSectionDto, @CurrentUser() user: any) {
    return this.academicsService.createSection(dto, user);
  }

  @RequirePermission(ModuleId.ACADEMICS, 'EDIT')
  @Put('sections/:id')
  updateSection(
    @Param('id') id: string,
    @Body() dto: UpdateSectionDto,
    @CurrentUser() user: any,
  ) {
    return this.academicsService.updateSection(id, dto, user);
  }

  @RequirePermission(ModuleId.ACADEMICS, 'DELETE')
  @Delete('sections/:id')
  removeSection(@Param('id') id: string, @CurrentUser() user: any) {
    return this.academicsService.removeSection(id, user);
  }

  @RequirePermission(ModuleId.ACADEMICS, 'ADD')
  @Post('subjects')
  createSubject(@Body() dto: CreateSubjectDto, @CurrentUser() user: any) {
    return this.academicsService.createSubject(dto, user);
  }

  @RequirePermission(ModuleId.ACADEMICS, 'EDIT')
  @Put('subjects/:id')
  updateSubject(
    @Param('id') id: string,
    @Body() dto: UpdateSubjectDto,
    @CurrentUser() user: any,
  ) {
    return this.academicsService.updateSubject(id, dto, user);
  }

  @RequirePermission(ModuleId.ACADEMICS, 'DELETE')
  @Delete('subjects/:id')
  removeSubject(@Param('id') id: string, @CurrentUser() user: any) {
    return this.academicsService.removeSubject(id, user);
  }

  @RequirePermission(ModuleId.ACADEMICS, 'ADD')
  @Post('assignments')
  assignTeacher(@Body() dto: AssignTeacherDto, @CurrentUser() user: any) {
    return this.academicsService.assignTeacher(dto, user);
  }

  @RequirePermission(ModuleId.ACADEMICS, 'DELETE')
  @Delete('assignments/:id')
  removeTeacherAssignment(@Param('id') id: string, @CurrentUser() user: any) {
    return this.academicsService.removeTeacherAssignment(id, user);
  }
}
