import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async findAll(customerId: string) {
    return this.prisma.favoriteWorker.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: {
        workerProfile: {
          include: {
            user: { select: { id: true, fullName: true, avatarUrl: true } },
            category: true,
            badges: { include: { badge: true } },
          },
        },
      },
    });
  }

  async add(customerId: string, workerProfileId: string) {
    const existing = await this.prisma.favoriteWorker.findFirst({
      where: { customerId, workerProfileId },
    });
    if (existing) throw new ConflictException('Already favorited');
    return this.prisma.favoriteWorker.create({ data: { customerId, workerProfileId } });
  }

  async remove(customerId: string, workerProfileId: string) {
    const f = await this.prisma.favoriteWorker.findFirst({
      where: { customerId, workerProfileId },
    });
    if (!f) throw new NotFoundException('Not in favorites');
    await this.prisma.favoriteWorker.delete({ where: { id: f.id } });
    return { removed: true };
  }

  async removeById(customerId: string, id: string) {
    const f = await this.prisma.favoriteWorker.findFirst({ where: { id, customerId } });
    if (!f) throw new NotFoundException('Favorite not found');
    await this.prisma.favoriteWorker.delete({ where: { id } });
    return { removed: true };
  }
}
