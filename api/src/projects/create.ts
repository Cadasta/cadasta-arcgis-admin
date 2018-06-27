import { create } from './db';
import { createGroups } from './groups';

export default async (event: AWSLambda.APIGatewayProxyEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
  const payload: ProjectRequestBody = JSON.parse(event.body);
  const user = JSON.parse(event.requestContext.authorizer.user).username;
  const token = event.requestContext.authorizer.authorization;

  let statusCode: number = 200;
  let body: string = '';
  try {
    const project: ProjectResponseBody = await create(payload.name, user);
    body = JSON.stringify(project);

    await createGroups(payload.groups, project.name, project.slug, user, token);
  } catch (error) {
    statusCode = 500;
    body = error.message;
  }

  return {
    statusCode,
    body,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
  };
};