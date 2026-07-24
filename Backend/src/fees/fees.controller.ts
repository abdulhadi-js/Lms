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
import { RolesGuard } from '../common/guards/roles.guard';
import { FeesService } from './fees.service';
import { CreateFeeDto, PayFeeDto, RefundFeeDto } from './dto/fee.dto';

@Controller('fees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  @Get()
  findAll(@Req() req: any, @Query('outstanding') outstanding: boolean) {
    if (outstanding) {
      return this.feesService.getOutstandingFees(
        req.user.role === 'STUDENT' ? req.user.id : undefined,
      );
    }
    return this.feesService.findAll(req.user);
  }

  @Post()
  create(@Body() dto: CreateFeeDto) {
    return this.feesService.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.feesService.findOne(id, req.user);
  }

  @Post(':id/pay')
  pay(@Param('id') id: string, @Body() dto: PayFeeDto, @Req() req: any) {
    return this.feesService.pay(id, dto, req.user.id);
  }

  @Patch(':id/refund')
  refund(@Param('id') id: string, @Body() dto: RefundFeeDto, @Req() req: any) {
    return this.feesService.refund(id, dto, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any, @Req() req: any) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException();
    return this.feesService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    if (req.user?.role !== 'ADMIN') throw new ForbiddenException();
    return this.feesService.remove(id);
  }
}
