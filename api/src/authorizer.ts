import fetch from 'isomorphic-fetch';
import 'isomorphic-form-data';
import { User } from './authorizer.types';

type Event = AWSLambda.CustomAuthorizerEvent;
type Response = AWSLambda.CustomAuthorizerResult;

const PORTAL = process.env.ARCGIS_PORTAL_URL;
const URL = `${PORTAL}/rest/community/self?f=json`;

export default async ({ authorizationToken: Authorization, methodArn: resource }: Event): Promise<Response> => {
  const headers = { Authorization };
  const response = await fetch(URL, { headers });
  const user: User = await response.json();

  // Currently, we're assuming that an org-admin is permitted to access any resource and
  // non-org-admins can't access any resource. In the future, we may want to build out
  // more customizable configuration to allow for different permissions required for
  // resources.
  // If we're to separate permissions based on action (e.g. require different user role
  // for reading from the DB than we do for writing to the DB), we'll need too rewrite
  // this authorizer as an Enhanced Request Authorizer:
  // https://aws.amazon.com/blogs/compute/using-enhanced-request-authorizers-in-amazon-api-gateway/
  const permitted: boolean = (user.role === 'org_admin') && user.disabled === false;
  // return generatePolicy(user.username, permitted, resource, { user: JSON.stringify(user) });
  return generatePolicy(user.username, permitted, resource, { user: JSON.stringify(user), authorization: Authorization });
};

const generatePolicy = (principalId: string, permitted: boolean, resource: string, context = {}): Response => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: permitted ? 'Allow' : 'Deny',
        Resource: resource
      }
    ]
  },
  context
});
