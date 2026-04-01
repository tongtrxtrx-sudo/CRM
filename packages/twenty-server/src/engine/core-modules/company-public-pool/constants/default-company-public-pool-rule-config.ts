import { type CrmCompanyPoolRuleConfig } from 'twenty-shared/utils';

export const DEFAULT_COMPANY_PUBLIC_POOL_RULE_CONFIG: CrmCompanyPoolRuleConfig =
  {
    maxDaysWithoutFollowUp: 30,
    maxDaysWithoutClosedWon: 180,
    reminderDaysBeforeReturn: 7,
  };
