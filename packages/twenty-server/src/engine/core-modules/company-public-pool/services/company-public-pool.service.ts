import { Injectable } from '@nestjs/common';

import {
  computeCrmCompanyPoolState,
  type CrmCompanyPoolRuleConfig,
  type CrmCompanyPoolStateInput,
  type CrmCompanyPoolStateResult,
} from 'twenty-shared/utils';

import { DEFAULT_COMPANY_PUBLIC_POOL_RULE_CONFIG } from 'src/engine/core-modules/company-public-pool/constants/default-company-public-pool-rule-config';
import {
  buildCompanyPublicPoolPatch,
  type CompanyPublicPoolPatch,
} from 'src/engine/core-modules/company-public-pool/utils/build-company-public-pool-patch.util';

type CompanyRecordLike = Record<string, unknown> & {
  crmOwnershipStatus?: string | null;
  crmLastAcquiredAt?: string | Date | null;
  crmLastFollowedUpAt?: string | Date | null;
  crmLastClosedWonAt?: string | Date | null;
  crmExpectedPoolReturnAt?: string | null;
};

@Injectable()
export class CompanyPublicPoolService {
  evaluateCompanyRecord({
    company,
    config = DEFAULT_COMPANY_PUBLIC_POOL_RULE_CONFIG,
    now,
  }: {
    company: CompanyRecordLike;
    config?: CrmCompanyPoolRuleConfig;
    now?: string | Date;
  }): {
    patch: CompanyPublicPoolPatch | null;
    state: CrmCompanyPoolStateResult | null;
  } {
    const hasRequiredCrmFields = this.hasRelevantCrmFields(company);

    if (!hasRequiredCrmFields) {
      return {
        patch: null,
        state: null,
      };
    }

    const companyStateInput: CrmCompanyPoolStateInput = {
      currentOwnershipStatus: company.crmOwnershipStatus ?? null,
      lastAcquiredAt: company.crmLastAcquiredAt ?? null,
      lastFollowedUpAt: company.crmLastFollowedUpAt ?? null,
      lastClosedWonAt: company.crmLastClosedWonAt ?? null,
      now,
    };

    const state = computeCrmCompanyPoolState({
      config,
      company: companyStateInput,
    });

    const patch = buildCompanyPublicPoolPatch({
      currentCompany: {
        crmExpectedPoolReturnAt:
          typeof company.crmExpectedPoolReturnAt === 'string'
            ? company.crmExpectedPoolReturnAt
            : null,
        crmOwnershipStatus: company.crmOwnershipStatus ?? null,
      },
      nextExpectedPoolReturnAt: state.expectedPoolReturnAt,
      nextOwnershipStatus: state.effectiveOwnershipStatus,
    });

    return {
      patch,
      state,
    };
  }

  private hasRelevantCrmFields(company: CompanyRecordLike): boolean {
    return [
      'crmOwnershipStatus',
      'crmExpectedPoolReturnAt',
      'crmLastAcquiredAt',
      'crmLastFollowedUpAt',
      'crmLastClosedWonAt',
    ].some((fieldName) => fieldName in company);
  }
}
