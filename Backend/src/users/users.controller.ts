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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../auth/guards/matrix.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ModuleId } from '../roles/entities/module-permission.entity';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, MatrixGuard)
@Controller('users')
export class UsersController {
  @Post('bulk-import')
  @RequirePermission(ModuleId.USERS_STAFF, 'ADD')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async bulkImport(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    if (!file) throw new BadRequestException('File is required');
    return this.usersService.bulkImport(file.buffer, user);
  }

  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermission(ModuleId.USERS_STAFF, 'ADD')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @RequirePermission(ModuleId.USERS_STAFF, 'VIEW')
  @ApiQuery({ name: 'roleId', required: false })
  findAll(
    @Query('roleId') roleId?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
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
      throw new BadRequestException('Controller error: ' + e.message);
    }
  }

  @Get('students/:id/unified')
  @RequirePermission(ModuleId.USERS_STUDENTS, 'VIEW')
  getUnifiedProfile(@Param('id') id: string) {
    return this.usersService.getUnifiedStudentProfile(id);
  }

  @Get(':id')
  @RequirePermission(ModuleId.USERS_STAFF, 'VIEW')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @RequirePermission(ModuleId.USERS_STAFF, 'EDIT')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @RequirePermission(ModuleId.USERS_STAFF, 'DELETE')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':id/reset-password')
  @RequirePermission(ModuleId.USERS_STAFF, 'EDIT')
  resetPassword(
    @Param('id') id: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.usersService.resetPassword(id, newPassword);
  }
}
