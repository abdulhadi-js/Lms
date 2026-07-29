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
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { FeesService } from './fees.service';
import { CreateFeeDto, PayFeeDto, RefundFeeDto, UpdateFeeDto } from './dto/fee.dto';

@Controller('fees')
@UseGuards(JwtAuthGuard, PermissionsGuard)
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
  refund(@Param('id') id: string, @Body() dto: RefundFeeDto, @Req() req: any) {
    if (!req.user?.permissions?.includes('MANAGE_FEES') && !req.user?.isSuperAdmin) throw new ForbiddenException();
    return this.feesService.refund(id, dto, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: UpdateFeeDto, @Req() req: any) {
    if (!req.user?.permissions?.includes('MANAGE_FEES') && !req.user?.isSuperAdmin) throw new ForbiddenException();
    return this.feesService.update(id, updateData, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    if (!req.user?.permissions?.includes('MANAGE_FEES') && !req.user?.isSuperAdmin) throw new ForbiddenException();
    return this.feesService.remove(id, req.user);
  }
}
