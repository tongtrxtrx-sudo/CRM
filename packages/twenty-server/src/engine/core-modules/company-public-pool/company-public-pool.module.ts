import { Module } from '@nestjs/common';
import { CompanyPublicPoolService } from 'src/engine/core-modules/company-public-pool/services/company-public-pool.service';

@Module({
  providers: [CompanyPublicPoolService],
  exports: [CompanyPublicPoolService],
})
export class CompanyPublicPoolModule {}
