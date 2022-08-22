import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  //exports the service as REST API
  exports: [PrismaService],
})
export class PrismaModule {}
