import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(includeInactive = false) {
    return this.prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [{ sortOrder: 'asc' } as any],
      include: { _count: { select: { workers: true } } },
    } as any);
  }

  async findOne(slug: string) {
    const cat = await this.prisma.category.findUnique({
      where: { slug },
      include: { skills: true, _count: { select: { workers: true } } },
    } as any);
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async create(data: any) {
    return this.prisma.category.create({ data });
  }

  async update(slug: string, data: any) {
    return this.prisma.category.update({ where: { slug }, data });
  }

  async remove(slug: string) {
    return this.prisma.category.delete({ where: { slug } });
  }
}
