import { type FieldsConfiguration } from '@/page-layout/types/FieldsConfiguration';

const createSection = (
  id: string,
  title: string,
  position: number,
  fieldNames: string[],
): FieldsConfiguration['sections'][number] => ({
  id,
  title,
  position,
  fields: fieldNames.map((fieldName, fieldIndex) => ({
    fieldMetadataId: fieldName,
    position: fieldIndex,
  })),
});

export const DEFAULT_COMPANY_CRM_FIELDS_CONFIGURATION: FieldsConfiguration = {
  __typename: 'FieldsConfiguration',
  configurationType: 'FIELDS',
  sections: [
    createSection('company-basic-info', 'Basic Info', 0, [
      'name',
      'domainName',
      'accountOwner',
      'address',
    ]),
    createSection('company-crm-management', 'CRM Management', 1, [
      'crmOwnershipStatus',
      'crmPrimarySourceChannel',
      'crmErpCode',
    ]),
    createSection('company-key-dates', 'Key Dates', 2, [
      'crmLastAcquiredAt',
      'crmLastFollowedUpAt',
      'crmLastClosedWonAt',
      'crmExpectedPoolReturnAt',
    ]),
    createSection('company-profile', 'Company Profile', 3, [
      'employees',
      'annualRecurringRevenue',
      'idealCustomerProfile',
      'linkedinLink',
      'xLink',
    ]),
  ],
};

export const DEFAULT_PERSON_CRM_FIELDS_CONFIGURATION: FieldsConfiguration = {
  __typename: 'FieldsConfiguration',
  configurationType: 'FIELDS',
  sections: [
    createSection('person-basic-info', 'Basic Info', 0, [
      'name',
      'company',
      'crmIsPrimaryContact',
      'jobTitle',
      'city',
    ]),
    createSection('person-primary-contacts', 'Primary Contacts', 1, [
      'emails',
      'phones',
      'crmWhatsappId',
    ]),
    createSection('person-channel-identities', 'Channel Identities', 2, [
      'crmWechatId',
      'crmAliwangwangId',
      'crmFacebookId',
      'linkedinLink',
      'xLink',
    ]),
    createSection('person-crm-source', 'CRM Source', 3, [
      'crmSourceChannel',
      'crmSourceCapturedAt',
    ]),
  ],
};
