import fetch from 'isomorphic-fetch';
import AWSLambda from 'aws-lambda';

import { userResponseFactory, responseBodyFactory } from '../spec/factories';
import handler from './authorizer';

jest.mock('isomorphic-fetch');

describe('API Gateway CustomAuthorizer', () => {
  let _initialEnv: {[key: string]: string};
  const eventBase: AWSLambda.CustomAuthorizerEvent = {
    authorizationToken: 'abcd12345',
    methodArn: 'example-arn',
    type: 'TOKEN'
  };
  const mockFetch = fetch as jest.Mock;

  beforeEach(() => {
    _initialEnv = process.env;
    process.env.ARCGIS_REST_URL = 'https://mockPortal.com';
  });

  afterEach(() => {
    process.env = _initialEnv;
    mockFetch.mockReset();
  });

  it('should produce valid API Gateway CustomAuthorizer AuthResponse', async () => {
    mockFetch.mockResolvedValue(responseBodyFactory(userResponseFactory()));
    const resp = await handler(eventBase);
    expect(typeof resp.principalId).toBe('string');
    expect(typeof resp.policyDocument).toBe('object');
    expect(resp.policyDocument.Version).toBe('2012-10-17');
    expect(Array.isArray(resp.policyDocument.Statement)).toBe(true);
    expect(resp.policyDocument.Statement.length > 0).toBe(true);
    resp.policyDocument.Statement.forEach(
      (statement: AWSLambda.Statement) => {
        expect(Object.keys(statement).length).toBe(3);
        Object.entries(statement).forEach(
          ([key, value]) => {
            expect(['Action', 'Effect', 'Resource']).toContain(key);
            expect(typeof value).toBe('string');
          }
        );
      }
    );
    Object.entries(resp.context || {}).forEach(
      ([key, value]) =>
        expect(['string', 'number', 'boolean']).toContain(typeof value)
    );
  });

  it('should allow admins', async () => {
    mockFetch.mockResolvedValue(
      responseBodyFactory(
        userResponseFactory({
          role: 'org_admin', disabled: false
        })
      )
    );
    const resp = await handler(eventBase);
    expect(resp.policyDocument.Statement.map(s => (s as any).Action)).toEqual(['execute-api:Invoke']); // tslint:disable-line
    expect(resp.policyDocument.Statement.map(s => s.Effect)).toEqual(['Allow']);
    expect(resp.policyDocument.Statement.map(s => (s as any).Resource)).toEqual([eventBase.methodArn]); // tslint:disable-line
  });

  it('should deny non-admins', async () => {
    mockFetch.mockResolvedValue(
      responseBodyFactory(
        userResponseFactory({
          role: 'viewer',
        })
      )
    );
    const resp = await handler(eventBase);
    expect(resp.policyDocument.Statement.map(s => s.Effect)).toEqual(['Deny']);
  });

  it('should deny disabled-admins', async () => {
    mockFetch.mockResolvedValue(
      responseBodyFactory(
        userResponseFactory({
          role: 'org_admin', disabled: true
        })
      )
    );
    const resp = await handler(eventBase);
    expect(resp.policyDocument.Statement.map(s => s.Effect)).toEqual(['Deny']);
  });

  it('should set principalId to response username', async () => {
    mockFetch.mockResolvedValue(
      responseBodyFactory(
        userResponseFactory({
          username: 'MyUser'
        })
      )
    );
    const resp = await handler(eventBase);
    expect(resp.principalId).toBe('MyUser');
  });

  it('should set JSON stringify\'d user at \'user\' key and authorization token in policy context', async () => {
    const user = responseBodyFactory(
      userResponseFactory({ role: 'org_admin', disabled: true })
    );
    mockFetch.mockResolvedValue(user);
    const resp = await handler(eventBase);
    expect(resp.context).toEqual({
      user: await user.text(),
      authorization: eventBase.authorizationToken
    });
  });

  it('should not catch fetch errors', async () => {
    // With async authorizers, any uncaught exception translates to a 403 Forbidden:
    // { "Message": "User is not authorized to access this resource with an explicit deny" }
    const err = new Error('Something bad, like portal down or bad API token...');
    mockFetch.mockRejectedValue(err);
    await expect(handler(eventBase)).rejects.toEqual(err);
  });
});
