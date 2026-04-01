import { buildCompanyPublicPoolPatch } from 'src/engine/core-modules/company-public-pool/utils/build-company-public-pool-patch.util';

describe('buildCompanyPublicPoolPatch', () => {
  it('should return null when ownership status and expected return date are unchanged', () => {
    expect(
      buildCompanyPublicPoolPatch({
        currentCompany: {
          crmOwnershipStatus: 'OWNED',
          crmExpectedPoolReturnAt: '2026-03-31T00:00:00.000Z',
        },
        nextOwnershipStatus: 'OWNED',
        nextExpectedPoolReturnAt: '2026-03-31T00:00:00.000Z',
      }),
    ).toBeNull();
  });

  it('should only patch expected pool return date when reminder is due', () => {
    expect(
      buildCompanyPublicPoolPatch({
        currentCompany: {
          crmOwnershipStatus: 'OWNED',
          crmExpectedPoolReturnAt: null,
        },
        nextOwnershipStatus: 'OWNED',
        nextExpectedPoolReturnAt: '2026-03-31T00:00:00.000Z',
      }),
    ).toEqual({
      crmExpectedPoolReturnAt: '2026-03-31T00:00:00.000Z',
    });
  });

  it('should patch ownership status and expected return date when returning to pool', () => {
    expect(
      buildCompanyPublicPoolPatch({
        currentCompany: {
          crmOwnershipStatus: 'OWNED',
          crmExpectedPoolReturnAt: null,
        },
        nextOwnershipStatus: 'PUBLIC_POOL',
        nextExpectedPoolReturnAt: '2026-03-31T00:00:00.000Z',
      }),
    ).toEqual({
      crmOwnershipStatus: 'PUBLIC_POOL',
      crmExpectedPoolReturnAt: '2026-03-31T00:00:00.000Z',
    });
  });
});
