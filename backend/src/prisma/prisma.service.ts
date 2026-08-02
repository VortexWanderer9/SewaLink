import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

export { Prisma };

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error' | 'beforeExit'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'error' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'info' },
      ],
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Prisma connected to PostgreSQL successfully');
    } catch (error) {
      this.logger.error('Failed to connect to PostgreSQL:', error);
      throw error;
    }

    this.$on('error', (event) => {
      this.logger.error(`Prisma error: ${event.message}`);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma disconnected');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV !== 'test') return;
    const models = Prisma.ModelName;
    const tables: string[] = Object.values(models) as string[];
    const trx = tables.map((table) =>
      this.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`),
    );
    await this.$transaction(trx);
  }
}
