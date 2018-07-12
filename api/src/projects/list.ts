import * as ProjectsDb from '../lib/db/projects';
import { response, errResponse, requiredPick} from '../lib/utils';

export default async (): Promise<AWSLambda.APIGatewayProxyResult> => {
  const { TABLE_NAME } = requiredPick(process.env, 'TABLE_NAME');
  try {
    return response(await ProjectsDb.list(TABLE_NAME));
  } catch (error) {
    console.error(JSON.stringify(error));
    return errResponse({
      msg: 'Failed to list projects',
      err: `[${error.code}] ${error.message}`,
    }, 500);
  }
};
