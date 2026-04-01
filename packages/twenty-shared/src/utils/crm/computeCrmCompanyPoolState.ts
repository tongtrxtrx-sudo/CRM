const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

export type CrmOwnershipStatus = 'OWNED' | 'PUBLIC_POOL';

export type CrmCompanyPoolRuleTrigger =
  | 'FOLLOW_UP_OVERDUE'
  | 'CLOSED_WON_OVERDUE'
  | null;

export type CrmCompanyPoolRuleConfig = {
  maxDaysWithoutFollowUp?: number | null;
  maxDaysWithoutClosedWon?: number | null;
  reminderDaysBeforeReturn?: number | null;
};

export type CrmCompanyPoolStateInput = {
  currentOwnershipStatus?: string | null;
  lastAcquiredAt?: Date | string | null;
  lastFollowedUpAt?: Date | string | null;
  lastClosedWonAt?: Date | string | null;
  now?: Date | string;
};

export type CrmCompanyPoolStateResult = {
  effectiveOwnershipStatus: CrmOwnershipStatus;
  expectedPoolReturnAt: string | null;
  shouldReturnToPublicPool: boolean;
  shouldNotifyOwner: boolean;
  trigger: CrmCompanyPoolRuleTrigger;
  triggerBaseDate: string | null;
};

type CandidateTrigger = {
  dueAt: Date;
  trigger: Exclude<CrmCompanyPoolRuleTrigger, null>;
  baseDate: Date;
};

const parseDate = (value: Date | string | null | undefined): Date | null => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value.getTime());
  }

  if (typeof value !== 'string' || value.trim() === '') {
    return null;
  }

  const parsedDate = new Date(value);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const addDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * ONE_DAY_IN_MS);

const normalizeOwnershipStatus = (
  currentOwnershipStatus?: string | null,
): CrmOwnershipStatus =>
  currentOwnershipStatus === 'PUBLIC_POOL' ? 'PUBLIC_POOL' : 'OWNED';

export const computeCrmCompanyPoolState = ({
  config,
  company,
}: {
  config: CrmCompanyPoolRuleConfig;
  company: CrmCompanyPoolStateInput;
}): CrmCompanyPoolStateResult => {
  const now = parseDate(company.now ?? new Date()) ?? new Date();
  const normalizedOwnershipStatus = normalizeOwnershipStatus(
    company.currentOwnershipStatus,
  );

  const lastAcquiredAt = parseDate(company.lastAcquiredAt);
  const lastFollowedUpAt = parseDate(company.lastFollowedUpAt);
  const lastClosedWonAt = parseDate(company.lastClosedWonAt);

  const candidates: CandidateTrigger[] = [];

  const followUpBaseDate = lastFollowedUpAt ?? lastAcquiredAt;

  if (
    typeof config.maxDaysWithoutFollowUp === 'number' &&
    config.maxDaysWithoutFollowUp >= 0 &&
    followUpBaseDate !== null
  ) {
    candidates.push({
      trigger: 'FOLLOW_UP_OVERDUE',
      baseDate: followUpBaseDate,
      dueAt: addDays(followUpBaseDate, config.maxDaysWithoutFollowUp),
    });
  }

  const closedWonBaseDate = lastClosedWonAt ?? lastAcquiredAt;

  if (
    typeof config.maxDaysWithoutClosedWon === 'number' &&
    config.maxDaysWithoutClosedWon >= 0 &&
    closedWonBaseDate !== null
  ) {
    candidates.push({
      trigger: 'CLOSED_WON_OVERDUE',
      baseDate: closedWonBaseDate,
      dueAt: addDays(closedWonBaseDate, config.maxDaysWithoutClosedWon),
    });
  }

  const earliestCandidate = [...candidates].sort(
    (leftCandidate: CandidateTrigger, rightCandidate: CandidateTrigger) =>
      leftCandidate.dueAt.getTime() - rightCandidate.dueAt.getTime(),
  )[0];

  if (earliestCandidate === undefined) {
    return {
      effectiveOwnershipStatus: normalizedOwnershipStatus,
      expectedPoolReturnAt: null,
      shouldReturnToPublicPool: false,
      shouldNotifyOwner: false,
      trigger: null,
      triggerBaseDate: null,
    };
  }

  const shouldReturnToPublicPool =
    normalizedOwnershipStatus !== 'PUBLIC_POOL' &&
    earliestCandidate.dueAt.getTime() <= now.getTime();

  const reminderThresholdDate =
    typeof config.reminderDaysBeforeReturn === 'number' &&
    config.reminderDaysBeforeReturn >= 0
      ? addDays(earliestCandidate.dueAt, -config.reminderDaysBeforeReturn)
      : null;

  const shouldNotifyOwner =
    normalizedOwnershipStatus !== 'PUBLIC_POOL' &&
    reminderThresholdDate !== null &&
    reminderThresholdDate.getTime() <= now.getTime() &&
    earliestCandidate.dueAt.getTime() > now.getTime();

  return {
    effectiveOwnershipStatus: shouldReturnToPublicPool
      ? 'PUBLIC_POOL'
      : normalizedOwnershipStatus,
    expectedPoolReturnAt: earliestCandidate.dueAt.toISOString(),
    shouldReturnToPublicPool,
    shouldNotifyOwner,
    trigger: shouldReturnToPublicPool ? earliestCandidate.trigger : null,
    triggerBaseDate: earliestCandidate.baseDate.toISOString(),
  };
};
