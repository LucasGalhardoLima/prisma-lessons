import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
// extends with PrismaClient to get Prisma functionality
export class PrismaService extends PrismaClient {
  //for Nest to work better with Prisma lifecycle
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
