import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { memoryStorage } from 'multer';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermissions('MANAGE_USERS')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @RequirePermissions('VIEW_USERS')
  @ApiQuery({ name: 'roleId', required: false })
  findAll(@Query('roleId') roleId?: string, @Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.usersService.findAll(roleId, limit, offset);
  }

  @Patch('profile')
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
      },
    }),
  )
  updateProfile(
    @CurrentUser() user: any,
    @Body() body: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      return this.usersService.updateProfile(user.id, body, file);
    } catch (e: any) {
      throw new BadRequestException("Controller error: " + e.message);
    }
  }

  @Get(':id')
  @RequirePermissions('VIEW_USERS')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('MANAGE_USERS')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @RequirePermissions('MANAGE_USERS')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':id/reset-password')
  @RequirePermissions('MANAGE_USERS')
  resetPassword(
    @Param('id') id: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.usersService.resetPassword(id, newPassword);
  }
}
