import { Test, type TestingModule } from '@nestjs/testing';

import { CompanyPublicPoolService } from 'src/engine/core-modules/company-public-pool/services/company-public-pool.service';

describe('CompanyPublicPoolService', () => {
  let service: CompanyPublicPoolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyPublicPoolService],
    }).compile();

    service = module.get<CompanyPublicPoolService>(CompanyPublicPoolService);
  });

  it('should create a reminder patch without changing ownership', () => {
    const result = service.evaluateCompanyRecord({
      company: {
        crmOwnershipStatus: 'OWNED',
        crmExpectedPoolReturnAt: null,
        crmLastAcquiredAt: '2026-02-01T00:00:00.000Z',
        crmLastFollowedUpAt: '2026-03-01T00:00:00.000Z',
        crmLastClosedWonAt: null,
      },
      now: '2026-03-26T00:00:00.000Z',
    });

    expect(result.state?.shouldNotifyOwner).toBe(true);
    expect(result.patch).toEqual({
      crmExpectedPoolReturnAt: '2026-03-31T00:00:00.000Z',
    });
  });

  it('should create a public pool patch when company is overdue', () => {
    const result = service.evaluateCompanyRecord({
      company: {
        crmOwnershipStatus: 'OWNED',
        crmExpectedPoolReturnAt: null,
        crmLastAcquiredAt: '2026-02-01T00:00:00.000Z',
        crmLastFollowedUpAt: '2026-03-01T00:00:00.000Z',
        crmLastClosedWonAt: null,
      },
      now: '2026-04-02T00:00:00.000Z',
    });

    expect(result.state?.shouldReturnToPublicPool).toBe(true);
    expect(result.patch).toEqual({
      crmOwnershipStatus: 'PUBLIC_POOL',
      crmExpectedPoolReturnAt: '2026-03-31T00:00:00.000Z',
    });
  });

  it('should skip patch when company payload has no crm fields at all', () => {
    const result = service.evaluateCompanyRecord({
      company: {
        id: 'company-1',
        name: 'Acme',
      },
    });

    expect(result.state).toBeNull();
    expect(result.patch).toBeNull();
  });
});
