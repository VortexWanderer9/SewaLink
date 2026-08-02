import { Controller, Get, Post, UseInterceptors, UploadedFiles, Body, Delete, Param, Patch } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser, CurrentUserType, Roles } from '../common/decorators/auth.decorator';
import { DocumentsService } from './documents.service';

const storage = diskStorage({
  destination: process.env.UPLOAD_DIR || './uploads',
  filename: (_req, file, cb) => {
    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    cb(null, `${Date.now()}-${randomName}${extname(file.originalname)}`);
  },
});

@ApiTags('Documents')
@ApiBearerAuth()
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'List my uploaded documents' })
  findAll(@CurrentUser() user: CurrentUserType) {
    return this.documentsService.findAll(user.id);
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10) },
    fileFilter: (_req, file, cb) => {
      const allowed = /jpeg|jpg|png|pdf|webp|heic/i;
      if (allowed.test(extname(file.originalname)) || allowed.test(file.mimetype)) cb(null, true);
      else cb(new Error('Unsupported file type'), false);
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
        types: { type: 'array', items: { type: 'string', example: 'CITIZENSHIP,CERTIFICATE,PROFILE_PHOTO' } },
      },
    },
  })
  @ApiOperation({ summary: 'Upload documents (citizenship, certificates, profile photo)' })
  upload(
    @CurrentUser() user: CurrentUserType,
    @UploadedFiles() files: any[],
    @Body() body: { types?: string[] },
  ) {
    const types = body.types?.[0]?.split(',') || Array(files.length).fill('OTHER');
    return this.documentsService.upload(user.id, files, types);
  }

  @Patch(':id/verify')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Verify or reject a document' })
  verify(
    @CurrentUser() admin: CurrentUserType,
    @Param('id') id: string,
    @Body() body: { isVerified: boolean; notes?: string },
  ) {
    return this.documentsService.verify(admin.id, id, body.isVerified, body.notes);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete my document' })
  remove(@CurrentUser() user: CurrentUserType, @Param('id') id: string) {
    return this.documentsService.remove(user.id, id);
  }
}
