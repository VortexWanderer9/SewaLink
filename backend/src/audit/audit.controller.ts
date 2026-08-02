import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../common/decorators/auth.decorator';
import { Role } from '@prisma/client';
import { AuditService } from './audit.service';

@ApiTags('Audit')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] List audit logs' })
  findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('action') action?: string,
    @Query('entityType') entityType?: string,
    @Query('userId') userId?: string,
  ) {
    return this.auditService.findAll({ skip, take, action, entityType, userId });
  }
}
