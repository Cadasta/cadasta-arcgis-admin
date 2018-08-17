import fetch from 'isomorphic-fetch';
import 'isomorphic-form-data';

type Event = AWSLambda.CustomAuthorizerEvent;
type Response = AWSLambda.CustomAuthorizerResult;

export default async ({ authorizationToken: Authorization, methodArn: Resource }: Event): Promise<Response> => {
  const SELF_URL = `${process.env.ARCGIS_REST_URL}/community/self?f=json`;

  const headers = { Authorization };
  const response = await fetch(SELF_URL, { headers });
  const user: User = await response.json();

  const [apiID, stage] = Resource.split('/');

  // Currently, we're assuming that an org-admin is permitted to access any resource and
  // non-org-admins can't access any resource. In the future, we may want to build out
  // more customizable configuration to allow for different permissions required for
  // resources.
  // If we're to separate permissions based on action (e.g. require different user role
  // for reading from the DB than we do for writing to the DB), we'll need too rewrite
  // this authorizer as an Enhanced Request Authorizer:
  // https://aws.amazon.com/blogs/compute/using-enhanced-request-authorizers-in-amazon-api-gateway/
  const permitted: boolean = (user.role === 'org_admin') && user.disabled === false;
  return {
    context: {
      authorization: Authorization,
      user: JSON.stringify(user)
    },
    policyDocument: {
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: permitted ? 'Allow' : 'Deny',
          Resource: `${apiID}/${stage}/*/*`
        }
      ],
      Version: '2012-10-17',
    },
    principalId: user.username
  };
};
