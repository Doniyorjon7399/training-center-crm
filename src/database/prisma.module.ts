import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SeederService } from './seeders/seader.service';
@Global()
@Module({
  imports: [],
  providers: [PrismaService, SeederService],
  exports: [PrismaService],
})
export class PrismaModule {}
