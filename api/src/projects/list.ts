import * as ProjectsDb from '../lib/db/projects';
import SentryWrapper from '../lib/sentry';
import { errResponse, requiredPick, response } from '../lib/utils';

const list = async ({queryStringParameters}: AWSLambda.APIGatewayProxyEvent): 
    Promise<AWSLambda.APIGatewayProxyResult> => {
  const { TABLE_NAME } = requiredPick(process.env, 'TABLE_NAME');
  const next = queryStringParameters ? queryStringParameters.next : null;
  try {
    return response(await ProjectsDb.list(TABLE_NAME, next));
  } catch (error) {
    console.error(JSON.stringify(error));
    return errResponse(
      {
        err: `[${error.code}] ${error.message}`,
        msg: 'Failed to list projects',
      },
      500
    );
  }
};

export default SentryWrapper.handler(list);