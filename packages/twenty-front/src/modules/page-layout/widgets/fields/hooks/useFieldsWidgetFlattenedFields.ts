import { type PageLayoutWidget } from '@/page-layout/types/PageLayoutWidget';
import { useFieldsWidgetSectionsWithFields } from '@/page-layout/widgets/fields/hooks/useFieldsWidgetSectionsWithFields';

export const useFieldsWidgetFlattenedFields = ({
  objectNameSingular,
  widget,
}: {
  objectNameSingular: string;
  widget: PageLayoutWidget;
}) => {
  const { sectionsWithFields } = useFieldsWidgetSectionsWithFields({
    objectNameSingular,
    widget,
  });

  const flattenedFieldMetadataItems = sectionsWithFields.flatMap(
    (section) => section.fields,
  );

  return { flattenedFieldMetadataItems };
};
