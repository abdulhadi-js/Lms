import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Req,
  Query,
  UseGuards,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../auth/guards/matrix.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ModuleId } from '../roles/entities/module-permission.entity';
import { FeesService } from './fees.service';
import { CreateFeeDto, PayFeeDto, RefundFeeDto, UpdateFeeDto } from './dto/fee.dto';

@Controller('fees')
@UseGuards(JwtAuthGuard, MatrixGuard)
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Get()
  findAll(@Req() req: any, @Query('outstanding') outstanding: boolean) {
    if (outstanding) {
      return this.feesService.getOutstandingFees(
        req.user.permissions?.includes('VIEW_FEES') || req.user.isSuperAdmin ? undefined : req.user.id,
        req.user
      );
    }
    return this.feesService.findAll(req.user);
  }

  @Post()
  @RequirePermission(ModuleId.FEES, 'ADD')
  create(@Body() dto: CreateFeeDto, @Req() req: any) {
    if (!req.user?.permissions?.includes('MANAGE_FEES') && !req.user?.isSuperAdmin) throw new ForbiddenException();
    return this.feesService.create(dto, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.feesService.findOne(id, req.user);
  }

  @Post(':id/pay')
  pay(@Param('id') id: string, @Body() dto: PayFeeDto, @Req() req: any) {
    return this.feesService.pay(id, dto, req.user);
  }

  @Patch(':id/refund')
  @RequirePermission(ModuleId.FEES, 'EDIT')
  refund(@Param('id') id: string, @Body() dto: RefundFeeDto, @Req() req: any) {
    if (!req.user?.permissions?.includes('MANAGE_FEES') && !req.user?.isSuperAdmin) throw new ForbiddenException();
    return this.feesService.refund(id, dto, req.user);
  }

  @Patch(':id')
  @RequirePermission(ModuleId.FEES, 'EDIT')
  update(@Param('id') id: string, @Body() updateData: UpdateFeeDto, @Req() req: any) {
    if (!req.user?.permissions?.includes('MANAGE_FEES') && !req.user?.isSuperAdmin) throw new ForbiddenException();
    return this.feesService.update(id, updateData, req.user);
  }

  @Delete(':id')
  @RequirePermission(ModuleId.FEES, 'DELETE')
  remove(@Param('id') id: string, @Req() req: any) {
    if (!req.user?.permissions?.includes('MANAGE_FEES') && !req.user?.isSuperAdmin) throw new ForbiddenException();
    return this.feesService.remove(id, req.user);
  }
}
