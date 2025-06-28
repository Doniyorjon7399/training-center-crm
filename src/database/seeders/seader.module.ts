import { Module } from '@nestjs/common';
import { SeederService } from './seader.service';

@Module({
  providers: [SeederService],
  exports: [SeederService],
})
export class seederModule {}
