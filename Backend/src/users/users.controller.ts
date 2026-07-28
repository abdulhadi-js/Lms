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
import { Role } from '../common/enums/roles.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT)
  @ApiQuery({ name: 'role', enum: Role, required: false })
  findAll(@Query('role') role?: Role, @Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.usersService.findAll(role, limit, offset);
  }

  @Patch('profile')
  @Roles(Role.ADMIN, Role.INSTRUCTOR, Role.STUDENT)
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
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post(':id/reset-password')
  @Roles(Role.ADMIN)
  resetPassword(
    @Param('id') id: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.usersService.resetPassword(id, newPassword);
  }
}
