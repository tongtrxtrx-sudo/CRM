import { type FieldsConfiguration } from '@/page-layout/types/FieldsConfiguration';
import { type PageLayoutWidget } from '@/page-layout/types/PageLayoutWidget';
import { useTemporaryFieldsConfiguration } from '@/page-layout/hooks/useTemporaryFieldsConfiguration';
import { buildWidgetVisibilityContext } from '@/page-layout/utils/buildWidgetVisibilityContext';
import { useFieldsWidgetFieldMetadataItems } from '@/page-layout/widgets/fields/hooks/useFieldsWidgetFieldMetadataItems';
import { filterAndOrderFieldsFromConfiguration } from '@/page-layout/widgets/fields/utils/filterAndOrderFieldsFromConfiguration';
import { useLayoutRenderingContext } from '@/ui/layout/contexts/LayoutRenderingContext';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';

const isFieldsConfiguration = (
  configuration: PageLayoutWidget['configuration'],
): configuration is FieldsConfiguration => {
  return (
    configuration != null &&
    typeof configuration === 'object' &&
    'configurationType' in configuration &&
    configuration.configurationType === 'FIELDS' &&
    'sections' in configuration &&
    Array.isArray(configuration.sections)
  );
};

export const useFieldsWidgetSectionsWithFields = (
  {
    objectNameSingular,
    widget,
  }: {
    objectNameSingular: string;
    widget: PageLayoutWidget;
  },
) => {
  const isMobile = useIsMobile();
  const { isInRightDrawer } = useLayoutRenderingContext();
  const { inlineFieldMetadataItems, legacyActivityTargetFieldMetadataItems } =
    useFieldsWidgetFieldMetadataItems({
      objectNameSingular,
    });
  const temporaryConfiguration =
    useTemporaryFieldsConfiguration(objectNameSingular);
  const fieldsConfiguration =
    isFieldsConfiguration(widget.configuration) &&
    widget.configuration.sections.length > 0
      ? widget.configuration
      : temporaryConfiguration;

  const context = buildWidgetVisibilityContext({ isMobile, isInRightDrawer });

  const allFieldMetadataItems = [
    ...legacyActivityTargetFieldMetadataItems,
    ...inlineFieldMetadataItems,
  ];

  const sectionsWithFields = filterAndOrderFieldsFromConfiguration({
    configuration: fieldsConfiguration,
    availableFieldMetadataItems: allFieldMetadataItems,
    context,
  });

  return { sectionsWithFields };
};
