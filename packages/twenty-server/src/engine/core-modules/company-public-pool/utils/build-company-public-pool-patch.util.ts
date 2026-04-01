import { type CrmOwnershipStatus } from 'twenty-shared/utils';

export type CompanyPublicPoolPatch = Partial<{
  crmOwnershipStatus: CrmOwnershipStatus;
  crmExpectedPoolReturnAt: string | null;
}>;

export const buildCompanyPublicPoolPatch = ({
  currentCompany,
  nextExpectedPoolReturnAt,
  nextOwnershipStatus,
}: {
  currentCompany: {
    crmExpectedPoolReturnAt?: string | null;
    crmOwnershipStatus?: string | null;
  };
  nextExpectedPoolReturnAt: string | null;
  nextOwnershipStatus: CrmOwnershipStatus;
}): CompanyPublicPoolPatch | null => {
  const patch: CompanyPublicPoolPatch = {};

  if (
    (currentCompany.crmExpectedPoolReturnAt ?? null) !== nextExpectedPoolReturnAt
  ) {
    patch.crmExpectedPoolReturnAt = nextExpectedPoolReturnAt;
  }

  if (
    (currentCompany.crmOwnershipStatus ?? 'OWNED') !== nextOwnershipStatus
  ) {
    patch.crmOwnershipStatus = nextOwnershipStatus;
  }

  return Object.keys(patch).length > 0 ? patch : null;
};
