import { type PageLayoutWidget } from '@/page-layout/types/PageLayoutWidget';
import { useFieldsWidgetSectionsWithFields } from '@/page-layout/widgets/fields/hooks/useFieldsWidgetSectionsWithFields';

export const useFieldsWidgetSectionsWithIndices = (
  {
    objectNameSingular,
    widget,
  }: {
    objectNameSingular: string;
    widget: PageLayoutWidget;
  },
) => {
  const { sectionsWithFields } = useFieldsWidgetSectionsWithFields({
    objectNameSingular,
    widget,
  });

  const sectionsWithFieldIndices = sectionsWithFields.map(
    (section, sectionIndex) => {
      const startIndex = sectionsWithFields
        .slice(0, sectionIndex)
        .reduce((sum, s) => sum + s.fields.length, 0);

      return {
        ...section,
        fields: section.fields.map((field, fieldIndex) => ({
          field,
          globalIndex: startIndex + fieldIndex,
        })),
      };
    },
  );

  return { sectionsWithFieldIndices };
};
