import { Test, type TestingModule } from '@nestjs/testing';

import { PersonProtectionService } from 'src/engine/core-modules/person-protection/services/person-protection.service';

describe('PersonProtectionService', () => {
  let service: PersonProtectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonProtectionService],
    }).compile();

    service = module.get<PersonProtectionService>(PersonProtectionService);
  });

  it('should treat person without company as unfiled and bypass ownership protection', () => {
    expect(
      service.evaluatePersonRecord({
        person: {
          id: 'person-1',
          name: 'Unfiled Lead',
        },
      }),
    ).toEqual({
      state: {
        isProtected: false,
        reason: 'UNFILED_CONTACT',
      },
      canBypassOwnershipProtection: true,
      hasResolvedCompanyOwnershipStatus: true,
    });
  });

  it('should expose unresolved ownership context when only companyId is present', () => {
    expect(
      service.evaluatePersonRecord({
        person: {
          id: 'person-2',
          companyId: 'company-1',
        },
      }),
    ).toEqual({
      state: {
        isProtected: true,
        reason: 'OWNED_COMPANY',
      },
      canBypassOwnershipProtection: false,
      hasResolvedCompanyOwnershipStatus: false,
    });
  });

  it('should expose unresolved ownership context when company relation is loaded without ownership status', () => {
    expect(
      service.evaluatePersonRecord({
        person: {
          id: 'person-2b',
          company: {
            id: 'company-1',
          },
        },
      }),
    ).toEqual({
      state: {
        isProtected: true,
        reason: 'OWNED_COMPANY',
      },
      canBypassOwnershipProtection: false,
      hasResolvedCompanyOwnershipStatus: false,
    });
  });

  it('should bypass ownership protection for people linked to a public pool company', () => {
    expect(
      service.evaluatePersonRecord({
        person: {
          id: 'person-3',
          companyId: 'company-1',
          company: {
            id: 'company-1',
            crmOwnershipStatus: 'PUBLIC_POOL',
          },
        },
      }),
    ).toEqual({
      state: {
        isProtected: false,
        reason: 'PUBLIC_POOL_COMPANY',
      },
      canBypassOwnershipProtection: true,
      hasResolvedCompanyOwnershipStatus: true,
    });
  });

  it('should keep people protected when linked to an owned company', () => {
    expect(
      service.evaluatePersonRecord({
        person: {
          id: 'person-4',
          company: {
            id: 'company-1',
            crmOwnershipStatus: 'OWNED',
          },
        },
      }),
    ).toEqual({
      state: {
        isProtected: true,
        reason: 'OWNED_COMPANY',
      },
      canBypassOwnershipProtection: false,
      hasResolvedCompanyOwnershipStatus: true,
    });
  });
});
