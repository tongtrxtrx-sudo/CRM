import crypto from 'node:crypto';

const metadataUrl =
  process.env.CRM_METADATA_URL ?? 'http://localhost:3000/metadata';
const locale = process.env.CRM_LOCALE ?? 'en';
const dryRun = !process.argv.includes('--apply');

const companyDefaultViewColumns = [
  { fieldName: 'name', position: 0, size: 220 },
  { fieldName: 'domainName', position: 1, size: 160 },
  { fieldName: 'crmOwnershipStatus', position: 2, size: 150 },
  { fieldName: 'accountOwner', position: 3, size: 160 },
  { fieldName: 'crmPrimarySourceChannel', position: 4, size: 160 },
  { fieldName: 'crmErpCode', position: 5, size: 150 },
  { fieldName: 'crmLastFollowedUpAt', position: 6, size: 170 },
  { fieldName: 'crmExpectedPoolReturnAt', position: 7, size: 170 },
];

const personDefaultViewColumns = [
  { fieldName: 'name', position: 0, size: 220 },
  { fieldName: 'company', position: 1, size: 180 },
  { fieldName: 'crmIsPrimaryContact', position: 2, size: 130 },
  { fieldName: 'emails', position: 3, size: 180 },
  { fieldName: 'phones', position: 4, size: 160 },
  { fieldName: 'crmWhatsappId', position: 5, size: 170 },
  { fieldName: 'crmSourceChannel', position: 6, size: 150 },
  { fieldName: 'crmSourceCapturedAt', position: 7, size: 170 },
];

const objectViewSpecs = [
  {
    objectNameSingular: 'company',
    viewName: 'All companies',
    viewIcon: 'IconSkyline',
    defaultColumns: companyDefaultViewColumns,
  },
  {
    objectNameSingular: 'person',
    viewName: 'All people',
    viewIcon: 'IconPerson',
    defaultColumns: personDefaultViewColumns,
  },
];

const objectMetadataQuery = `
  query CrmObjectMetadataItems {
    objects(paging: { first: 1000 }) {
      edges {
        node {
          id
          nameSingular
          fieldsList {
            id
            name
            label
            type
          }
        }
      }
    }
  }
`;

const findManyCoreViewsQuery = `
  query FindManyCoreViews($objectMetadataId: String) {
    getCoreViews(objectMetadataId: $objectMetadataId) {
      id
      name
      objectMetadataId
      key
      position
      viewFields {
        id
        fieldMetadataId
        viewId
        isVisible
        position
        size
        aggregateOperation
        createdAt
        updatedAt
        deletedAt
      }
    }
  }
`;

const createCoreViewMutation = `
  mutation CreateCoreView($input: CreateViewInput!) {
    createCoreView(input: $input) {
      id
      name
      objectMetadataId
      key
      position
      viewFields {
        id
        fieldMetadataId
        viewId
        isVisible
        position
        size
        aggregateOperation
        createdAt
        updatedAt
        deletedAt
      }
    }
  }
`;

const createManyCoreViewFieldsMutation = `
  mutation CreateManyCoreViewFields($inputs: [CreateViewFieldInput!]!) {
    createManyCoreViewFields(inputs: $inputs) {
      id
      fieldMetadataId
      viewId
      isVisible
      position
      size
      aggregateOperation
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

const updateCoreViewFieldMutation = `
  mutation UpdateCoreViewField($input: UpdateViewFieldInput!) {
    updateCoreViewField(input: $input) {
      id
      fieldMetadataId
      viewId
      isVisible
      position
      size
      aggregateOperation
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

const buildHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'x-locale': locale,
  };

  if (process.env.CRM_COOKIE) {
    headers.Cookie = process.env.CRM_COOKIE;
  }

  if (process.env.CRM_AUTHORIZATION) {
    headers.Authorization = process.env.CRM_AUTHORIZATION;
  }

  return headers;
};

const postGraphql = async ({ query, variables, operationName }) => {
  const response = await fetch(metadataUrl, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({
      query,
      variables,
      operationName,
    }),
  });

  const json = await response.json();

  if (!response.ok || json.errors) {
    throw new Error(
      JSON.stringify(
        {
          status: response.status,
          statusText: response.statusText,
          errors: json.errors,
        },
        null,
        2,
      ),
    );
  }

  return json.data;
};

const summarizeViewFieldDiff = (existingViewField, desiredViewField) => {
  const diffs = [];

  if (existingViewField.isVisible !== desiredViewField.isVisible) {
    diffs.push('isVisible');
  }

  if (existingViewField.position !== desiredViewField.position) {
    diffs.push('position');
  }

  if (existingViewField.size !== desiredViewField.size) {
    diffs.push('size');
  }

  return diffs;
};

const ensureIndexView = async ({
  objectMetadataId,
  objectNameSingular,
  viewName,
  viewIcon,
  existingViews,
}) => {
  const existingIndexView = existingViews.find((view) => view.key === 'INDEX');

  if (existingIndexView) {
    return existingIndexView;
  }

  console.log(`[crm-views] CREATE VIEW ${objectNameSingular}.INDEX`);

  if (dryRun) {
    return null;
  }

  const nextPosition =
    existingViews.reduce(
      (maxPosition, view) => Math.max(maxPosition, view.position ?? 0),
      -1,
    ) + 1;

  const createdViewData = await postGraphql({
    query: createCoreViewMutation,
    operationName: 'CreateCoreView',
    variables: {
      input: {
        id: crypto.randomUUID(),
        name: viewName,
        icon: viewIcon,
        key: 'INDEX',
        type: 'TABLE',
        objectMetadataId,
        openRecordIn: 'SIDE_PANEL',
        visibility: 'WORKSPACE',
        position: nextPosition,
        isCompact: false,
        shouldHideEmptyGroups: false,
      },
    },
  });

  return createdViewData.createCoreView;
};

const main = async () => {
  console.log(
    dryRun
      ? '[crm-views] Running in dry-run mode. Pass --apply to mutate default views.'
      : '[crm-views] Running in apply mode.',
  );

  const objectMetadataData = await postGraphql({
    query: objectMetadataQuery,
    operationName: 'CrmObjectMetadataItems',
  });

  const objectMetadataItems = objectMetadataData.objects.edges.map(
    ({ node }) => node,
  );

  for (const objectViewSpec of objectViewSpecs) {
    const objectMetadataItem = objectMetadataItems.find(
      (item) => item.nameSingular === objectViewSpec.objectNameSingular,
    );

    if (!objectMetadataItem) {
      throw new Error(
        `Object ${objectViewSpec.objectNameSingular} not found in metadata response.`,
      );
    }

    console.log(
      `\n[crm-views] Processing ${objectViewSpec.objectNameSingular} (${objectMetadataItem.id})`,
    );

    const viewsData = await postGraphql({
      query: findManyCoreViewsQuery,
      operationName: 'FindManyCoreViews',
      variables: {
        objectMetadataId: objectMetadataItem.id,
      },
    });

    const existingViews = viewsData.getCoreViews ?? [];
    const indexView = await ensureIndexView({
      objectMetadataId: objectMetadataItem.id,
      objectNameSingular: objectViewSpec.objectNameSingular,
      viewName: objectViewSpec.viewName,
      viewIcon: objectViewSpec.viewIcon,
      existingViews,
    });

    if (!indexView) {
      console.log(
        `[crm-views] SKIP ${objectViewSpec.objectNameSingular}.INDEX field sync (view missing in dry-run mode)`,
      );
      continue;
    }

    const createInputs = [];
    const updateInputs = [];

    for (const desiredColumn of objectViewSpec.defaultColumns) {
      const fieldMetadataItem = objectMetadataItem.fieldsList.find(
        (field) => field.name === desiredColumn.fieldName,
      );

      if (!fieldMetadataItem) {
        console.log(
          `[crm-views] MISSING ${objectViewSpec.objectNameSingular}.${desiredColumn.fieldName}`,
        );
        continue;
      }

      const existingViewField = indexView.viewFields.find(
        (viewField) => viewField.fieldMetadataId === fieldMetadataItem.id,
      );

      const desiredViewField = {
        fieldMetadataId: fieldMetadataItem.id,
        isVisible: true,
        position: desiredColumn.position,
        size: desiredColumn.size,
      };

      if (!existingViewField) {
        console.log(
          `[crm-views] CREATE ${objectViewSpec.objectNameSingular}.${desiredColumn.fieldName}`,
        );

        createInputs.push({
          id: crypto.randomUUID(),
          viewId: indexView.id,
          ...desiredViewField,
        });
        continue;
      }

      const diffs = summarizeViewFieldDiff(existingViewField, desiredViewField);

      if (diffs.length === 0) {
        console.log(
          `[crm-views] SKIP ${objectViewSpec.objectNameSingular}.${desiredColumn.fieldName} (already aligned)`,
        );
        continue;
      }

      console.log(
        `[crm-views] UPDATE ${objectViewSpec.objectNameSingular}.${desiredColumn.fieldName} -> ${diffs.join(', ')}`,
      );

      updateInputs.push({
        input: {
          id: existingViewField.id,
          update: desiredViewField,
        },
      });
    }

    if (!dryRun && createInputs.length > 0) {
      await postGraphql({
        query: createManyCoreViewFieldsMutation,
        operationName: 'CreateManyCoreViewFields',
        variables: {
          inputs: createInputs,
        },
      });
    }

    if (!dryRun) {
      for (const updateInput of updateInputs) {
        await postGraphql({
          query: updateCoreViewFieldMutation,
          operationName: 'UpdateCoreViewField',
          variables: updateInput,
        });
      }
    }
  }
};

main().catch((error) => {
  console.error('[crm-views] Failed:', error);
  process.exit(1);
});
