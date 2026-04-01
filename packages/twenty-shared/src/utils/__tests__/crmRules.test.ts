import { computeCrmCompanyPoolState } from '@/utils/crm/computeCrmCompanyPoolState';
import { getCrmPersonProtectionState } from '@/utils/crm/getCrmPersonProtectionState';

describe('computeCrmCompanyPoolState', () => {
  it('should keep company owned when no rule can be evaluated', () => {
    const result = computeCrmCompanyPoolState({
      config: {},
      company: {
        currentOwnershipStatus: 'OWNED',
        now: '2026-04-02T00:00:00.000Z',
      },
    });

    expect(result).toEqual({
      effectiveOwnershipStatus: 'OWNED',
      expectedPoolReturnAt: null,
      shouldReturnToPublicPool: false,
      shouldNotifyOwner: false,
      trigger: null,
      triggerBaseDate: null,
    });
  });

  it('should compute expected pool return date from latest follow-up when available', () => {
    const result = computeCrmCompanyPoolState({
      config: {
        maxDaysWithoutFollowUp: 30,
      },
      company: {
        currentOwnershipStatus: 'OWNED',
        lastAcquiredAt: '2026-02-01T00:00:00.000Z',
        lastFollowedUpAt: '2026-03-01T00:00:00.000Z',
        now: '2026-03-15T00:00:00.000Z',
      },
    });

    expect(result).toMatchObject({
      effectiveOwnershipStatus: 'OWNED',
      expectedPoolReturnAt: '2026-03-31T00:00:00.000Z',
      shouldReturnToPublicPool: false,
      shouldNotifyOwner: false,
      trigger: null,
      triggerBaseDate: '2026-03-01T00:00:00.000Z',
    });
  });

  it('should mark company for notification before the earliest pool return date', () => {
    const result = computeCrmCompanyPoolState({
      config: {
        maxDaysWithoutFollowUp: 30,
        maxDaysWithoutClosedWon: 180,
        reminderDaysBeforeReturn: 7,
      },
      company: {
        currentOwnershipStatus: 'OWNED',
        lastAcquiredAt: '2026-02-01T00:00:00.000Z',
        lastFollowedUpAt: '2026-03-01T00:00:00.000Z',
        now: '2026-03-26T00:00:00.000Z',
      },
    });

    expect(result).toMatchObject({
      effectiveOwnershipStatus: 'OWNED',
      expectedPoolReturnAt: '2026-03-31T00:00:00.000Z',
      shouldReturnToPublicPool: false,
      shouldNotifyOwner: true,
      trigger: null,
    });
  });

  it('should move company to public pool when follow-up rule is overdue', () => {
    const result = computeCrmCompanyPoolState({
      config: {
        maxDaysWithoutFollowUp: 30,
        reminderDaysBeforeReturn: 7,
      },
      company: {
        currentOwnershipStatus: 'OWNED',
        lastAcquiredAt: '2026-02-01T00:00:00.000Z',
        lastFollowedUpAt: '2026-03-01T00:00:00.000Z',
        now: '2026-04-02T00:00:00.000Z',
      },
    });

    expect(result).toMatchObject({
      effectiveOwnershipStatus: 'PUBLIC_POOL',
      expectedPoolReturnAt: '2026-03-31T00:00:00.000Z',
      shouldReturnToPublicPool: true,
      shouldNotifyOwner: false,
      trigger: 'FOLLOW_UP_OVERDUE',
      triggerBaseDate: '2026-03-01T00:00:00.000Z',
    });
  });

  it('should choose the earliest due date across configured rules', () => {
    const result = computeCrmCompanyPoolState({
      config: {
        maxDaysWithoutFollowUp: 30,
        maxDaysWithoutClosedWon: 180,
      },
      company: {
        currentOwnershipStatus: 'OWNED',
        lastAcquiredAt: '2026-01-01T00:00:00.000Z',
        lastFollowedUpAt: '2026-03-20T00:00:00.000Z',
        lastClosedWonAt: '2026-01-05T00:00:00.000Z',
        now: '2026-04-01T00:00:00.000Z',
      },
    });

    expect(result).toMatchObject({
      expectedPoolReturnAt: '2026-04-19T00:00:00.000Z',
      triggerBaseDate: '2026-03-20T00:00:00.000Z',
    });
  });

  it('should keep public pool companies in public pool without reminders', () => {
    const result = computeCrmCompanyPoolState({
      config: {
        maxDaysWithoutFollowUp: 30,
        reminderDaysBeforeReturn: 7,
      },
      company: {
        currentOwnershipStatus: 'PUBLIC_POOL',
        lastAcquiredAt: '2026-02-01T00:00:00.000Z',
        lastFollowedUpAt: '2026-03-01T00:00:00.000Z',
        now: '2026-03-27T00:00:00.000Z',
      },
    });

    expect(result).toMatchObject({
      effectiveOwnershipStatus: 'PUBLIC_POOL',
      shouldReturnToPublicPool: false,
      shouldNotifyOwner: false,
      trigger: null,
    });
  });
});

describe('getCrmPersonProtectionState', () => {
  it('should treat person without company as unfiled and unprotected', () => {
    expect(getCrmPersonProtectionState({})).toEqual({
      isProtected: false,
      reason: 'UNFILED_CONTACT',
    });
  });

  it('should treat person linked to public pool company as unprotected', () => {
    expect(
      getCrmPersonProtectionState({
        companyId: 'company-1',
        company: {
          id: 'company-1',
          crmOwnershipStatus: 'PUBLIC_POOL',
        },
      }),
    ).toEqual({
      isProtected: false,
      reason: 'PUBLIC_POOL_COMPANY',
    });
  });

  it('should protect person linked to owned company', () => {
    expect(
      getCrmPersonProtectionState({
        company: {
          id: 'company-1',
          crmOwnershipStatus: 'OWNED',
        },
      }),
    ).toEqual({
      isProtected: true,
      reason: 'OWNED_COMPANY',
    });
  });
});
