import { Controller, Get, Param, Post, Body, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Public, Roles } from '../common/decorators/auth.decorator';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all service categories' })
  findAll(@Query('includeInactive') includeInactive?: boolean) {
    return this.categoriesService.findAll(includeInactive);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get category by slug' })
  findOne(@Param('slug') slug: string) {
    return this.categoriesService.findOne(slug);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Create category' })
  create(@Body() data: any) {
    return this.categoriesService.create(data);
  }

  @Put(':slug')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Update category' })
  update(@Param('slug') slug: string, @Body() data: any) {
    return this.categoriesService.update(slug, data);
  }

  @Delete(':slug')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Delete category' })
  remove(@Param('slug') slug: string) {
    return this.categoriesService.remove(slug);
  }
}
