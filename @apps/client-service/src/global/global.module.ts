import { Module, forwardRef } from '@nestjs/common';
import { GlobalService } from './global.service';
import { BusinessModule } from '../business/business.module';

@Module({
  imports: [forwardRef(()=> BusinessModule)],
  providers: [GlobalService],
  exports: [GlobalService]
})
export class GlobalModule {}
