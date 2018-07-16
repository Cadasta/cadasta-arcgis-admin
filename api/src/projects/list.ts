import * as ProjectsDb from '../lib/db/projects';
import { response, errResponse, requiredPick} from '../lib/utils';

export default async ({queryStringParameters}: AWSLambda.APIGatewayProxyEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
  const { TABLE_NAME } = requiredPick(process.env, 'TABLE_NAME');
  const next = queryStringParameters ? queryStringParameters.next : null;
  try {
    return response(await ProjectsDb.list(TABLE_NAME, next));
  } catch (error) {
    console.error(JSON.stringify(error));
    return errResponse({
      msg: 'Failed to list projects',
      err: `[${error.code}] ${error.message}`,
    }, 500);
  }
};
