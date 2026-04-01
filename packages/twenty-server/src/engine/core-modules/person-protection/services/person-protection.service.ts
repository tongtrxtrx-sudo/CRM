import { Injectable } from '@nestjs/common';

import {
  getCrmPersonProtectionState,
  type CrmPersonProtectionInput,
  type CrmPersonProtectionState,
} from 'twenty-shared/utils';

type CompanyRecordLike = Record<string, unknown> & {
  id?: string | null;
  crmOwnershipStatus?: string | null;
};

type PersonRecordLike = Record<string, unknown> & {
  companyId?: string | null;
  company?: CompanyRecordLike | null;
};

export type PersonProtectionEvaluationResult = {
  state: CrmPersonProtectionState;
  canBypassOwnershipProtection: boolean;
  hasResolvedCompanyOwnershipStatus: boolean;
};

@Injectable()
export class PersonProtectionService {
  evaluatePersonRecord({
    person,
  }: {
    person: PersonRecordLike;
  }): PersonProtectionEvaluationResult {
    const companyId = this.resolveCompanyId(person);
    const company = this.resolveCompany(person);
    const state = getCrmPersonProtectionState({
      companyId,
      company,
    });

    return {
      state,
      canBypassOwnershipProtection: state.isProtected === false,
      hasResolvedCompanyOwnershipStatus:
        state.reason === 'UNFILED_CONTACT' ||
        this.hasResolvedCompanyOwnershipStatus(companyId, company),
    };
  }

  private resolveCompanyId(person: PersonRecordLike): string | null {
    const companyIdFromRelation = this.resolveCompany(person)?.id ?? null;

    return person.companyId ?? companyIdFromRelation ?? null;
  }

  private resolveCompany(
    person: PersonRecordLike,
  ): CrmPersonProtectionInput['company'] {
    if (person.company === null) {
      return null;
    }

    if (typeof person.company !== 'object' || person.company === undefined) {
      return undefined;
    }

    const company: NonNullable<CrmPersonProtectionInput['company']> = {
      id: person.company.id ?? null,
    };

    if ('crmOwnershipStatus' in person.company) {
      company.crmOwnershipStatus = person.company.crmOwnershipStatus ?? null;
    }

    return company;
  }

  private hasResolvedCompanyOwnershipStatus(
    companyId: string | null,
    company: CrmPersonProtectionInput['company'],
  ): boolean {
    if (companyId === null || companyId === '') {
      return true;
    }

    if (company === null || company === undefined) {
      return false;
    }

    return 'crmOwnershipStatus' in company;
  }
}
