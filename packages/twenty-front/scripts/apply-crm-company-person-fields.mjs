import crypto from 'node:crypto';

const metadataUrl =
  process.env.CRM_METADATA_URL ?? 'http://localhost:3000/metadata';
const locale = process.env.CRM_LOCALE ?? 'en';
const dryRun = !process.argv.includes('--apply');
const updateExisting = process.argv.includes('--update-existing');

const companyFieldSpecs = [
  {
    name: 'crmOwnershipStatus',
    label: 'CRM Ownership Status',
    description: 'CRM ownership state for pool and assignment workflows',
    icon: 'IconHierarchy',
    type: 'SELECT',
    options: [
      {
        color: 'blue',
        label: 'Owned',
        value: 'OWNED',
        position: 0,
      },
      {
        color: 'orange',
        label: 'Public Pool',
        value: 'PUBLIC_POOL',
        position: 1,
      },
    ],
  },
  {
    name: 'crmPrimarySourceChannel',
    label: 'CRM Primary Source Channel',
    description: 'Primary lead acquisition channel for this customer',
    icon: 'IconBroadcast',
    type: 'SELECT',
    options: [
      {
        color: 'green',
        label: 'WhatsApp',
        value: 'WHATSAPP',
        position: 0,
      },
      {
        color: 'sky',
        label: 'Email',
        value: 'EMAIL',
        position: 1,
      },
      {
        color: 'purple',
        label: 'Website Chat',
        value: 'WEBSITE_CHAT',
        position: 2,
      },
      {
        color: 'gray',
        label: 'Manual',
        value: 'MANUAL',
        position: 3,
      },
    ],
  },
  {
    name: 'crmErpCode',
    label: 'CRM ERP Code',
    description: 'ERP mapping code for downstream order and finance sync',
    icon: 'IconHash',
    type: 'TEXT',
  },
  {
    name: 'crmLastAcquiredAt',
    label: 'CRM Last Acquired At',
    description: 'Most recent time this customer was acquired',
    icon: 'IconCalendarPlus',
    type: 'DATE_TIME',
  },
  {
    name: 'crmLastFollowedUpAt',
    label: 'CRM Last Followed Up At',
    description: 'Most recent effective follow-up time',
    icon: 'IconClock',
    type: 'DATE_TIME',
  },
  {
    name: 'crmLastClosedWonAt',
    label: 'CRM Last Closed Won At',
    description: 'Most recent closed-won time for this customer',
    icon: 'IconCalendarCheck',
    type: 'DATE_TIME',
  },
  {
    name: 'crmExpectedPoolReturnAt',
    label: 'CRM Expected Pool Return At',
    description: 'Expected return-to-pool time from CRM assignment rules',
    icon: 'IconCalendarTime',
    type: 'DATE_TIME',
  },
];

const personFieldSpecs = [
  {
    name: 'crmSourceChannel',
    label: 'CRM Source Channel',
    description: 'First source channel captured for this contact',
    icon: 'IconBroadcast',
    type: 'SELECT',
    options: [
      {
        color: 'green',
        label: 'WhatsApp',
        value: 'WHATSAPP',
        position: 0,
      },
      {
        color: 'sky',
        label: 'Email',
        value: 'EMAIL',
        position: 1,
      },
      {
        color: 'purple',
        label: 'Website Chat',
        value: 'WEBSITE_CHAT',
        position: 2,
      },
      {
        color: 'gray',
        label: 'Manual',
        value: 'MANUAL',
        position: 3,
      },
    ],
  },
  {
    name: 'crmSourceCapturedAt',
    label: 'CRM Source Captured At',
    description: 'First time this contact entered CRM',
    icon: 'IconCalendarPlus',
    type: 'DATE_TIME',
  },
  {
    name: 'crmWhatsappId',
    label: 'CRM WhatsApp ID',
    description: 'WhatsApp handle or phone used for follow-up',
    icon: 'IconBrandWhatsapp',
    type: 'TEXT',
  },
  {
    name: 'crmWechatId',
    label: 'CRM WeChat ID',
    description: 'WeChat identifier for the contact',
    icon: 'IconMessageCircle',
    type: 'TEXT',
  },
  {
    name: 'crmAliwangwangId',
    label: 'CRM Aliwangwang ID',
    description: 'Aliwangwang identifier for the contact',
    icon: 'IconMessage2',
    type: 'TEXT',
  },
  {
    name: 'crmFacebookId',
    label: 'CRM Facebook ID',
    description: 'Facebook identifier for the contact',
    icon: 'IconBrandFacebook',
    type: 'TEXT',
  },
  {
    name: 'crmIsPrimaryContact',
    label: 'CRM Is Primary Contact',
    description: 'Whether this person is the primary contact for the company',
    icon: 'IconUserStar',
    type: 'BOOLEAN',
    defaultValue: false,
  },
];

const objectSpecs = [
  {
    objectNameSingular: 'company',
    fieldSpecs: companyFieldSpecs,
  },
  {
    objectNameSingular: 'person',
    fieldSpecs: personFieldSpecs,
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
            description
            icon
            defaultValue
            options
          }
        }
      }
    }
  }
`;

const createFieldMutation = `
  mutation CreateOneFieldMetadataItem($input: CreateOneFieldMetadataInput!) {
    createOneField(input: $input) {
      id
      name
      label
      type
    }
  }
`;

const updateFieldMutation = `
  mutation UpdateOneFieldMetadataItem(
    $idToUpdate: UUID!
    $updatePayload: UpdateFieldInput!
  ) {
    updateOneField(input: { id: $idToUpdate, update: $updatePayload }) {
      id
      name
      label
      type
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

const normalizeComparableValue = (value) =>
  value == null ? null : JSON.stringify(value);

const hashOptionId = (fieldName, optionValue) =>
  crypto
    .createHash('sha1')
    .update(`${fieldName}:${optionValue}`)
    .digest('hex')
    .slice(0, 16);

const buildFieldInput = (objectMetadataId, fieldSpec) => ({
  objectMetadataId,
  type: fieldSpec.type,
  name: fieldSpec.name,
  label: fieldSpec.label,
  description: fieldSpec.description ?? null,
  icon: fieldSpec.icon ?? null,
  isActive: true,
  isNullable: true,
  isUnique: false,
  isLabelSyncedWithName: false,
  defaultValue:
    fieldSpec.defaultValue === undefined ? null : fieldSpec.defaultValue,
  options:
    fieldSpec.options?.map((option) => ({
      ...option,
      id: option.id ?? hashOptionId(fieldSpec.name, option.value),
    })) ?? null,
  settings: fieldSpec.settings ?? null,
});

const summarizeDiff = (existingField, nextInput) => {
  const diffs = [];

  const comparablePairs = [
    ['label', existingField.label, nextInput.label],
    ['description', existingField.description, nextInput.description],
    ['icon', existingField.icon, nextInput.icon],
    ['type', existingField.type, nextInput.type],
    ['defaultValue', existingField.defaultValue, nextInput.defaultValue],
    ['options', existingField.options, nextInput.options],
  ];

  for (const [label, existingValue, nextValue] of comparablePairs) {
    if (
      normalizeComparableValue(existingValue) !==
      normalizeComparableValue(nextValue)
    ) {
      diffs.push(label);
    }
  }

  return diffs;
};

const main = async () => {
  console.log(
    dryRun
      ? '[crm-fields] Running in dry-run mode. Pass --apply to mutate metadata.'
      : '[crm-fields] Running in apply mode.',
  );

  const data = await postGraphql({
    query: objectMetadataQuery,
    operationName: 'CrmObjectMetadataItems',
  });

  const objectMetadataItems = data.objects.edges.map(({ node }) => node);

  for (const objectSpec of objectSpecs) {
    const objectMetadataItem = objectMetadataItems.find(
      (item) => item.nameSingular === objectSpec.objectNameSingular,
    );

    if (!objectMetadataItem) {
      throw new Error(
        `Object ${objectSpec.objectNameSingular} not found in metadata response.`,
      );
    }

    console.log(
      `\n[crm-fields] Processing ${objectSpec.objectNameSingular} (${objectMetadataItem.id})`,
    );

    for (const fieldSpec of objectSpec.fieldSpecs) {
      const existingField = objectMetadataItem.fieldsList.find(
        (field) => field.name === fieldSpec.name,
      );

      const nextInput = buildFieldInput(objectMetadataItem.id, fieldSpec);

      if (!existingField) {
        console.log(
          `[crm-fields] CREATE ${objectSpec.objectNameSingular}.${fieldSpec.name}`,
        );

        if (!dryRun) {
          await postGraphql({
            query: createFieldMutation,
            operationName: 'CreateOneFieldMetadataItem',
            variables: {
              input: {
                field: nextInput,
              },
            },
          });
        }

        continue;
      }

      const diffs = summarizeDiff(existingField, nextInput);

      if (diffs.length === 0) {
        console.log(
          `[crm-fields] SKIP ${objectSpec.objectNameSingular}.${fieldSpec.name} (already aligned)`,
        );
        continue;
      }

      console.log(
        `[crm-fields] ${updateExisting ? 'UPDATE' : 'DRIFT'} ${objectSpec.objectNameSingular}.${fieldSpec.name} -> ${diffs.join(', ')}`,
      );

      if (!dryRun && updateExisting) {
        await postGraphql({
          query: updateFieldMutation,
          operationName: 'UpdateOneFieldMetadataItem',
          variables: {
            idToUpdate: existingField.id,
            updatePayload: {
              label: nextInput.label,
              description: nextInput.description,
              icon: nextInput.icon,
              name: nextInput.name,
              defaultValue: nextInput.defaultValue,
              options: nextInput.options,
              isLabelSyncedWithName: nextInput.isLabelSyncedWithName,
            },
          },
        });
      }
    }
  }
};

main().catch((error) => {
  console.error('[crm-fields] Failed:', error);
  process.exit(1);
});
