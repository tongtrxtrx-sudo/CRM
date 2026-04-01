import { filterAndOrderFieldsFromConfiguration } from '@/page-layout/widgets/fields/utils/filterAndOrderFieldsFromConfiguration';
import { type FieldsConfiguration } from '@/page-layout/types/FieldsConfiguration';

const buildField = (id: string, name: string) =>
  ({
    id,
    name,
  }) as any;

describe('filterAndOrderFieldsFromConfiguration', () => {
  it('should resolve configured fields by field name and keep section order', () => {
    const configuration: FieldsConfiguration = {
      __typename: 'FieldsConfiguration',
      configurationType: 'FIELDS',
      sections: [
        {
          id: 'crm-section',
          title: 'CRM',
          position: 0,
          fields: [
            { fieldMetadataId: 'crmOwnershipStatus', position: 0 },
            { fieldMetadataId: 'name', position: 1 },
          ],
        },
      ],
    };

    const sections = filterAndOrderFieldsFromConfiguration({
      configuration,
      availableFieldMetadataItems: [
        buildField('field-1', 'name'),
        buildField('field-2', 'crmOwnershipStatus'),
      ],
      context: {},
    });

    expect(sections).toHaveLength(1);
    expect(sections[0].fields.map((field) => field.name)).toEqual([
      'crmOwnershipStatus',
      'name',
    ]);
  });

  it('should resolve configured fields by metadata id and drop missing entries', () => {
    const configuration: FieldsConfiguration = {
      __typename: 'FieldsConfiguration',
      configurationType: 'FIELDS',
      sections: [
        {
          id: 'basic-section',
          title: 'Basic',
          position: 0,
          fields: [
            { fieldMetadataId: 'field-2', position: 0 },
            { fieldMetadataId: 'missing-field', position: 1 },
            { fieldMetadataId: 'field-1', position: 2 },
          ],
        },
      ],
    };

    const sections = filterAndOrderFieldsFromConfiguration({
      configuration,
      availableFieldMetadataItems: [
        buildField('field-1', 'name'),
        buildField('field-2', 'company'),
      ],
      context: {},
    });

    expect(sections).toHaveLength(1);
    expect(sections[0].fields.map((field) => field.id)).toEqual([
      'field-2',
      'field-1',
    ]);
  });
});
