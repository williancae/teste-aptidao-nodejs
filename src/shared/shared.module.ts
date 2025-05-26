import { Module } from '@nestjs/common';
import { CacheService } from './services/cache.service';
import { SharedService } from './services/shared.service';

@Module({
  providers: [SharedService, CacheService],
  exports: [SharedService, CacheService],
})
export class SharedModule {}