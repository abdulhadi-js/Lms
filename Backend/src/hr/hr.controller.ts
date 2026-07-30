import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Put,
} from '@nestjs/common';
import { HrService } from './hr.service';
import { UpdateStaffProfileDto } from './dto/update-staff-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../auth/guards/matrix.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ModuleId } from '../roles/entities/module-permission.entity';

@Controller('hr')
@UseGuards(JwtAuthGuard, MatrixGuard)
export class HrController {
  constructor(private readonly hrService: HrService) {}

  @RequirePermission(ModuleId.USERS_STAFF, 'VIEW')
  @Get('profile/:userId')
  getProfile(@Param('userId') userId: string) {
    return this.hrService.getStaffProfile(userId);
  }

  @RequirePermission(ModuleId.USERS_STAFF, 'EDIT')
  @Put('profile/:userId')
  updateProfile(
    @Param('userId') userId: string,
    @Body() dto: UpdateStaffProfileDto,
  ) {
    return this.hrService.updateStaffProfile(userId, dto);
  }
}
