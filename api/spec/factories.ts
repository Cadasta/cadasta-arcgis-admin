export const responseBodyFactory = (responseBody: object): Body => ({
  bodyUsed: true,
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)), // TODO
  blob: () => Promise.resolve(new Blob()), // TODO
  formData: () => Promise.resolve(new FormData), // TODO
  json: () => Promise.resolve(responseBody),
  text: () => Promise.resolve(JSON.stringify(responseBody)),
});

export const userResponseFactory = (userDetails = {}) => responseBodyFactory(
  {
    username: 'factoryUser',
    role: 'org_admin',
    disabled: false,
    ...userDetails
  }
);

export const APIGatewayProxyEventFactory = (body: {}, method: string = 'GET'): AWSLambda.APIGatewayProxyEvent => ({
  body: JSON.stringify(body),
  headers: {},
  httpMethod: method,
  isBase64Encoded: false,
  path: '/projects/',
  pathParameters: null,
  queryStringParameters: null,
  stageVariables: null,
  requestContext: {
    accountId: 'oroick',
    apiId: 'API',
    httpMethod: method,
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
    path: '/projects/',
    stage: 'test',
    requestId: '1',
    requestTimeEpoch: 0,
    resourceId: '1',
    resourcePath: '1',
    authorizer: {
      user: JSON.stringify(userResponseFactory()),
      authorization: 'abc123'
    }
  },
  resource: 'string'
});
