import { Module } from '@nestjs/common';

import { PersonProtectionService } from 'src/engine/core-modules/person-protection/services/person-protection.service';

@Module({
  providers: [PersonProtectionService],
  exports: [PersonProtectionService],
})
export class PersonProtectionModule {}
