import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async findAll(userId: string) {
    return this.prisma.document.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async upload(userId: string, files: any[], types: string[]) {
    const created: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const data: Prisma.DocumentCreateInput = {
        user: { connect: { id: userId } },
        type: types[i] || 'OTHER',
        fileName: f.originalname || f.filename,
        filePath: f.path || f.location || f.filename,
        fileSize: f.size,
        mimeType: f.mimetype,
      };
      const doc = await (this.prisma.document as unknown as { create: (args: { data: Prisma.DocumentCreateInput }) => Promise<any> }).create({ data });
      created.push(doc);
    }
    return created;
  }

  async verify(adminId: string, docId: string, isVerified: boolean, notes?: string) {
    const doc = await this.prisma.document.findUnique({ where: { id: docId } });
    if (!doc) throw new NotFoundException('Document not found');
    const updated = await this.prisma.document.update({
      where: { id: docId },
      data: { isVerified, verifiedAt: isVerified ? new Date() : null, notes },
    });
    await this.audit.log(
      'DOC_VERIFY',
      'DOCUMENT',
      docId,
      { isVerified: doc.isVerified },
      { isVerified },
      undefined,
      undefined,
      adminId,
    );
    return updated;
  }

  async remove(userId: string, docId: string) {
    const doc = await this.prisma.document.findFirst({ where: { id: docId, userId } });
    if (!doc) throw new NotFoundException('Document not found');
    return this.prisma.document.delete({ where: { id: docId } });
  }
}
