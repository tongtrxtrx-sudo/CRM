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
