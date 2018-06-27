import { create } from './db';

export default async (event: AWSLambda.APIGatewayProxyEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
  const payload: ProjectRequestBody = JSON.parse(event.body);
  let statusCode: number = 200;
  let body: string = '';
  try {
    const project: ProjectResponseBody = await create(payload.name, 'oroick');
    body = JSON.stringify(project);
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