import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser, CurrentUserType, Roles } from '../common/decorators/auth.decorator';
import { FavoritesService } from './favorites.service';

@ApiTags('Favorites')
@ApiBearerAuth()
@Roles(Role.CUSTOMER, Role.ADMIN)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: '[Customer] My favorite workers' })
  findAll(@CurrentUser() user: CurrentUserType) {
    return this.favoritesService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: '[Customer] Add worker to favorites' })
  add(@CurrentUser() user: CurrentUserType, @Body() body: { workerProfileId: string }) {
    return this.favoritesService.add(user.id, body.workerProfileId);
  }

  @Delete('by-worker/:workerProfileId')
  @ApiOperation({ summary: '[Customer] Remove from favorites by worker profile ID' })
  remove(@CurrentUser() user: CurrentUserType, @Param('workerProfileId') workerProfileId: string) {
    return this.favoritesService.remove(user.id, workerProfileId);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[Customer] Remove from favorites by favorite ID' })
  removeById(@CurrentUser() user: CurrentUserType, @Param('id') id: string) {
    return this.favoritesService.removeById(user.id, id);
  }
}
