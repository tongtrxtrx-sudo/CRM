import { type CrmOwnershipStatus } from '@/utils/crm/computeCrmCompanyPoolState';

export type CrmPersonProtectionReason =
  | 'UNFILED_CONTACT'
  | 'PUBLIC_POOL_COMPANY'
  | 'OWNED_COMPANY';

export type CrmPersonProtectionInput = {
  companyId?: string | null;
  company?: {
    id?: string | null;
    crmOwnershipStatus?: string | null;
  } | null;
};

export type CrmPersonProtectionState = {
  isProtected: boolean;
  reason: CrmPersonProtectionReason;
};

const normalizeOwnershipStatus = (
  currentOwnershipStatus?: string | null,
): CrmOwnershipStatus =>
  currentOwnershipStatus === 'PUBLIC_POOL' ? 'PUBLIC_POOL' : 'OWNED';

export const getCrmPersonProtectionState = ({
  company,
  companyId,
}: CrmPersonProtectionInput): CrmPersonProtectionState => {
  const resolvedCompanyId = companyId ?? company?.id ?? null;

  if (resolvedCompanyId === null || resolvedCompanyId === '') {
    return {
      isProtected: false,
      reason: 'UNFILED_CONTACT',
    };
  }

  const ownershipStatus = normalizeOwnershipStatus(
    company?.crmOwnershipStatus,
  );

  if (ownershipStatus === 'PUBLIC_POOL') {
    return {
      isProtected: false,
      reason: 'PUBLIC_POOL_COMPANY',
    };
  }

  return {
    isProtected: true,
    reason: 'OWNED_COMPANY',
  };
};
