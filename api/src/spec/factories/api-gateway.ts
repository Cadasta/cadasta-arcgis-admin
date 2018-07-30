import { userResponseFactory } from '.';

export const responseBodyFactory = (responseBody: object): Body => ({
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)), // TODO
  blob: () => Promise.resolve(new Blob()), // TODO
  bodyUsed: true,
  formData: () => Promise.resolve(new FormData), // TODO
  json: () => Promise.resolve(responseBody),
  text: () => Promise.resolve(JSON.stringify(responseBody)),
});

export const APIGatewayProxyEventFactory = (opts: {[key: string]: any} = {}): AWSLambda.APIGatewayProxyEvent => {
  opts = {
    authorization: 'abc123',
    body: {},
    headers: {},
    method: 'GET',
    path: '/projects/',
    user: userResponseFactory(),
    ...opts,
  };
  return {
    body: JSON.stringify(opts.body),
    headers: opts.headers,
    httpMethod: opts.method,
    isBase64Encoded: false,
    path: opts.path,
    pathParameters: null,
    queryStringParameters: opts.queryStringParameters,
    requestContext: {
      accountId: 'oroick',
      apiId: 'API',
      authorizer: {
        authorization: opts.authorization,
        user: JSON.stringify(opts.user),
      },
      httpMethod: opts.method,
      identity: {
        accessKey: null,
        accountId: null,
        apiKey: null,
        apiKeyId: null,
        caller: null,
        cognitoAuthenticationProvider: null,
        cognitoAuthenticationType: null,
        cognitoIdentityId: null,
        cognitoIdentityPoolId: null,
        sourceIp: '127.0.0.1',
        user: null,
        userAgent: null,
        userArn: null,
      },
      path: opts.path,
      requestId: '1',
      requestTimeEpoch: 0,
      resourceId: '1',
      resourcePath: '1',
      stage: 'test',
    },
    resource: 'string',
    stageVariables: null
  };
};
