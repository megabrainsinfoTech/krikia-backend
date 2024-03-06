import { Module } from '@nestjs/common';
import { LibMetaService } from './lib-meta.service';

@Module({
  providers: [LibMetaService]
})
export class LibMetaModule {}
