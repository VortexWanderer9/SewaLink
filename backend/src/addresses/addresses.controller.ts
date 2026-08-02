import { Controller, Get, Post, Body, Param, Put, Delete, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser, CurrentUserType } from '../common/decorators/auth.decorator';
import { AddressesService } from './addresses.service';

@ApiTags('Addresses')
@ApiBearerAuth()
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: 'List my saved addresses' })
  findAll(@CurrentUser() user: CurrentUserType) {
    return this.addressesService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get address by ID' })
  findOne(@CurrentUser() user: CurrentUserType, @Param('id') id: string) {
    return this.addressesService.findOne(user.id, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new address' })
  create(@CurrentUser() user: CurrentUserType, @Body() dto: any) {
    return this.addressesService.create(user.id, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update address' })
  update(@CurrentUser() user: CurrentUserType, @Param('id') id: string, @Body() dto: any) {
    return this.addressesService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete address' })
  remove(@CurrentUser() user: CurrentUserType, @Param('id') id: string) {
    return this.addressesService.remove(user.id, id);
  }

  @Patch(':id/default')
  @ApiOperation({ summary: 'Set address as default' })
  setDefault(@CurrentUser() user: CurrentUserType, @Param('id') id: string) {
    return this.addressesService.setDefault(user.id, id);
  }
}
