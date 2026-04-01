import crypto from 'node:crypto';
import http from 'node:http';

const port = Number(process.env.MOCK_BACKEND_PORT ?? 3000);

const clientConfig = {
  aiModels: [],
  signInPrefilled: true,
  isMultiWorkspaceEnabled: false,
  isEmailVerificationRequired: false,
  authProviders: {
    google: true,
    magicLink: false,
    password: true,
    microsoft: false,
    sso: [],
  },
  frontDomain: 'localhost',
  defaultSubdomain: 'app',
  chromeExtensionId: 'MOCKED_EXTENSION_ID',
  analyticsEnabled: false,
  support: {
    supportDriver: 'NONE',
    supportFrontChatId: null,
  },
  sentry: {},
  billing: {
    isBillingEnabled: true,
    billingUrl: '',
    trialPeriods: [
      {
        duration: 30,
        isCreditCardRequired: true,
      },
      {
        duration: 7,
        isCreditCardRequired: false,
      },
    ],
  },
  captcha: {},
  api: { mutationMaximumAffectedRecords: 100 },
  canManageFeatureFlags: true,
  publicFeatureFlags: [],
  isMicrosoftMessagingEnabled: true,
  isMicrosoftCalendarEnabled: true,
  isGoogleMessagingEnabled: true,
  isGoogleCalendarEnabled: true,
  isAttachmentPreviewEnabled: true,
  isConfigVariablesInDbEnabled: false,
  isImapSmtpCaldavEnabled: false,
  isTwoFactorAuthenticationEnabled: false,
  isEmailingDomainsEnabled: false,
  isCloudflareIntegrationEnabled: false,
};

const publicWorkspaceDataByDomain = {
  __typename: 'PublicWorkspaceDataOutput',
  id: '9870323e-22c3-4d14-9b7f-5bdc84f7d6ee',
  logo: null,
  displayName: 'Twenty Eng',
  workspaceUrls: {
    __typename: 'WorkspaceUrls',
    customUrl: 'https://twenty-eng.com',
    subdomainUrl: 'https://custom.twenty.com',
  },
  authProviders: {
    __typename: 'AuthProviders',
    sso: [],
    google: true,
    magicLink: false,
    password: true,
    microsoft: false,
  },
  authBypassProviders: {
    __typename: 'AuthBypassProviders',
    google: false,
    password: false,
    microsoft: false,
  },
};

const createMockField = ({
  objectNameSingular,
  name,
  label,
  type,
  isCustom = false,
}) => ({
  id: `mock-${objectNameSingular}-${name}-field-id`,
  name,
  label,
  type,
  isCustom,
  description: null,
  icon: null,
  defaultValue: null,
  options: null,
});

const objectMetadataStore = [
  {
    id: 'mock-company-object-metadata-id',
    nameSingular: 'company',
    fieldsList: [
      createMockField({
        objectNameSingular: 'company',
        name: 'name',
        label: 'Name',
        type: 'TEXT',
      }),
      createMockField({
        objectNameSingular: 'company',
        name: 'domainName',
        label: 'Domain Name',
        type: 'LINKS',
      }),
      createMockField({
        objectNameSingular: 'company',
        name: 'accountOwner',
        label: 'Account Owner',
        type: 'RELATION',
      }),
      createMockField({
        objectNameSingular: 'company',
        name: 'address',
        label: 'Address',
        type: 'ADDRESS',
      }),
      createMockField({
        objectNameSingular: 'company',
        name: 'employees',
        label: 'Employees',
        type: 'NUMBER',
      }),
      createMockField({
        objectNameSingular: 'company',
        name: 'annualRecurringRevenue',
        label: 'Annual Recurring Revenue',
        type: 'CURRENCY',
      }),
      createMockField({
        objectNameSingular: 'company',
        name: 'idealCustomerProfile',
        label: 'Ideal Customer Profile',
        type: 'BOOLEAN',
      }),
      createMockField({
        objectNameSingular: 'company',
        name: 'linkedinLink',
        label: 'LinkedIn',
        type: 'LINKS',
      }),
      createMockField({
        objectNameSingular: 'company',
        name: 'xLink',
        label: 'X',
        type: 'LINKS',
      }),
    ],
  },
  {
    id: 'mock-person-object-metadata-id',
    nameSingular: 'person',
    fieldsList: [
      createMockField({
        objectNameSingular: 'person',
        name: 'name',
        label: 'Name',
        type: 'FULL_NAME',
      }),
      createMockField({
        objectNameSingular: 'person',
        name: 'company',
        label: 'Company',
        type: 'RELATION',
      }),
      createMockField({
        objectNameSingular: 'person',
        name: 'jobTitle',
        label: 'Job Title',
        type: 'TEXT',
      }),
      createMockField({
        objectNameSingular: 'person',
        name: 'city',
        label: 'City',
        type: 'TEXT',
      }),
      createMockField({
        objectNameSingular: 'person',
        name: 'emails',
        label: 'Emails',
        type: 'EMAILS',
      }),
      createMockField({
        objectNameSingular: 'person',
        name: 'phones',
        label: 'Phones',
        type: 'PHONES',
      }),
      createMockField({
        objectNameSingular: 'person',
        name: 'linkedinLink',
        label: 'LinkedIn',
        type: 'LINKS',
      }),
      createMockField({
        objectNameSingular: 'person',
        name: 'xLink',
        label: 'X',
        type: 'LINKS',
      }),
      createMockField({
        objectNameSingular: 'person',
        name: 'intro',
        label: 'Intro',
        type: 'TEXT',
      }),
    ],
  },
];

const createMockIndexView = ({
  id,
  objectMetadataId,
  name,
  icon,
}) => ({
  id,
  name,
  objectMetadataId,
  key: 'INDEX',
  icon,
  position: 0,
  viewFields: [],
});

const coreViewsStore = [
  createMockIndexView({
    id: 'mock-company-index-view-id',
    objectMetadataId: 'mock-company-object-metadata-id',
    name: 'All companies',
    icon: 'IconSkyline',
  }),
  createMockIndexView({
    id: 'mock-person-index-view-id',
    objectMetadataId: 'mock-person-object-metadata-id',
    name: 'All people',
    icon: 'IconPerson',
  }),
];

const checkUserExists = {
  __typename: 'CheckUserExistOutput',
  exists: true,
  availableWorkspacesCount: 1,
  isEmailVerified: true,
};

const getCorsHeaders = (request) => {
  const requestedHeaders =
    typeof request.headers['access-control-request-headers'] === 'string'
      ? request.headers['access-control-request-headers']
      : 'content-type, authorization, apollo-require-preflight, x-schema-version, x-locale';

  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': requestedHeaders,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };
};

const json = (request, response, statusCode, payload) => {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    ...getCorsHeaders(request),
  });
  response.end(JSON.stringify(payload));
};

const collectBody = async (request) => {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return {};
  }
};

const server = http.createServer(async (request, response) => {
  if (!request.url) {
    json(request, response, 404, { error: 'Missing URL' });
    return;
  }

  if (request.method === 'OPTIONS') {
    json(request, response, 204, {});
    return;
  }

  if (request.method === 'GET' && request.url === '/client-config') {
    json(request, response, 200, clientConfig);
    return;
  }

  if (request.method === 'POST' && request.url === '/metadata') {
    const body = await collectBody(request);
    const operationName =
      body.operationName ||
      (typeof body.query === 'string' && body.query.match(/\b(query|mutation)\s+(\w+)/)?.[2]) ||
      null;

    if (operationName === 'GetPublicWorkspaceDataByDomain') {
      json(request, response, 200, {
        data: {
          getPublicWorkspaceDataByDomain: publicWorkspaceDataByDomain,
        },
      });
      return;
    }

    if (operationName === 'TrackAnalytics') {
      json(request, response, 200, {
        data: {
          trackAnalytics: {
            success: 1,
          },
        },
      });
      return;
    }

    if (operationName === 'CheckUserExists') {
      json(request, response, 200, {
        data: {
          checkUserExists,
        },
      });
      return;
    }

    if (operationName === 'IntrospectionQuery') {
      json(request, response, 200, {
        data: {
          __schema: {
            queryType: { name: 'Query' },
            mutationType: { name: 'Mutation' },
            types: [],
            directives: [],
          },
        },
      });
      return;
    }

    if (operationName === 'CrmObjectMetadataItems') {
      json(request, response, 200, {
        data: {
          objects: {
            edges: objectMetadataStore.map((node) => ({
              node,
            })),
          },
        },
      });
      return;
    }

    if (operationName === 'CreateOneFieldMetadataItem') {
      const fieldInput = body.variables?.input?.field;
      const objectMetadata = objectMetadataStore.find(
        (item) => item.id === fieldInput?.objectMetadataId,
      );

      if (!objectMetadata) {
        json(request, response, 200, {
          errors: [
            {
              message: `Object metadata ${fieldInput?.objectMetadataId ?? 'unknown'} not found`,
            },
          ],
        });
        return;
      }

      const createdField = {
        id: crypto.randomUUID(),
        name: fieldInput.name,
        label: fieldInput.label,
        type: fieldInput.type,
        isCustom: true,
        description: fieldInput.description ?? null,
        icon: fieldInput.icon ?? null,
        defaultValue: fieldInput.defaultValue ?? null,
        options: fieldInput.options ?? null,
      };

      objectMetadata.fieldsList.push(createdField);

      json(request, response, 200, {
        data: {
          createOneField: createdField,
        },
      });
      return;
    }

    if (operationName === 'UpdateOneFieldMetadataItem') {
      const fieldMetadataId = body.variables?.idToUpdate;
      const updatePayload = body.variables?.updatePayload ?? {};

      const objectMetadata = objectMetadataStore.find((item) =>
        item.fieldsList.some((field) => field.id === fieldMetadataId),
      );

      const existingField = objectMetadata?.fieldsList.find(
        (field) => field.id === fieldMetadataId,
      );

      if (!objectMetadata || !existingField) {
        json(request, response, 200, {
          errors: [
            {
              message: `Field metadata ${fieldMetadataId ?? 'unknown'} not found`,
            },
          ],
        });
        return;
      }

      Object.assign(existingField, updatePayload);

      json(request, response, 200, {
        data: {
          updateOneField: existingField,
        },
      });
      return;
    }

    if (operationName === 'FindManyCoreViews') {
      const objectMetadataId = body.variables?.objectMetadataId;
      const views =
        typeof objectMetadataId === 'string'
          ? coreViewsStore.filter(
              (view) => view.objectMetadataId === objectMetadataId,
            )
          : coreViewsStore;

      json(request, response, 200, {
        data: {
          getCoreViews: views,
        },
      });
      return;
    }

    if (operationName === 'CreateCoreView') {
      const input = body.variables?.input ?? {};
      const createdView = {
        id: input.id ?? crypto.randomUUID(),
        name: input.name,
        objectMetadataId: input.objectMetadataId,
        key: input.key ?? null,
        icon: input.icon ?? 'IconList',
        position: input.position ?? coreViewsStore.length,
        viewFields: [],
      };

      coreViewsStore.push(createdView);

      json(request, response, 200, {
        data: {
          createCoreView: createdView,
        },
      });
      return;
    }

    if (operationName === 'CreateManyCoreViewFields') {
      const inputs = Array.isArray(body.variables?.inputs)
        ? body.variables.inputs
        : [];

      const createdViewFields = inputs.map((input) => ({
        id: input.id ?? crypto.randomUUID(),
        fieldMetadataId: input.fieldMetadataId,
        viewId: input.viewId,
        isVisible: input.isVisible ?? true,
        position: input.position ?? 0,
        size: input.size ?? 100,
        aggregateOperation: input.aggregateOperation ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      }));

      for (const createdViewField of createdViewFields) {
        const view = coreViewsStore.find(
          (coreView) => coreView.id === createdViewField.viewId,
        );

        if (view) {
          view.viewFields.push(createdViewField);
        }
      }

      json(request, response, 200, {
        data: {
          createManyCoreViewFields: createdViewFields,
        },
      });
      return;
    }

    if (operationName === 'UpdateCoreViewField') {
      const input = body.variables?.input ?? {};

      const view = coreViewsStore.find((coreView) =>
        coreView.viewFields.some((viewField) => viewField.id === input.id),
      );

      const existingViewField = view?.viewFields.find(
        (viewField) => viewField.id === input.id,
      );

      if (!view || !existingViewField) {
        json(request, response, 200, {
          errors: [
            {
              message: `View field ${input.id ?? 'unknown'} not found`,
            },
          ],
        });
        return;
      }

      Object.assign(existingViewField, input.update ?? {}, {
        updatedAt: new Date().toISOString(),
      });

      json(request, response, 200, {
        data: {
          updateCoreViewField: existingViewField,
        },
      });
      return;
    }

    json(request, response, 200, {
      data: {},
    });
    return;
  }

  json(request, response, 404, {
    error: 'Not found',
    method: request.method,
    url: request.url,
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Mock preview backend listening on http://127.0.0.1:${port}`);
});
