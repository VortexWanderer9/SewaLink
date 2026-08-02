import { Controller, Get, Put, Body, Param, Patch, Query, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles, CurrentUser, CurrentUserType } from '../common/decorators/auth.decorator';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my profile with customer/worker details' })
  me(@CurrentUser() user: CurrentUserType) {
    return this.usersService.me(user.id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update my profile (name, email, avatar, password)' })
  updateMe(@CurrentUser() user: CurrentUserType, @Body() dto: any) {
    return this.usersService.updateMe(user.id, dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] List all users' })
  findAll(
    @Query('role') role?: Role,
    @Query('q') q?: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.usersService.findAll(role, skip, take, q);
  }

  @Patch(':id/active')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Activate/deactivate user' })
  setActive(
    @CurrentUser() admin: CurrentUserType,
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
  ) {
    return this.usersService.setActive(admin.id, id, body.isActive);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Soft-delete user' })
  remove(@CurrentUser() admin: CurrentUserType, @Param('id') id: string) {
    return this.usersService.remove(admin.id, id);
  }
}
