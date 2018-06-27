import { v4 as uuid } from 'uuid';
/*
Consider using https://awslabs.github.io/dynamodb-data-mapper-js/
*/
interface Body {
  name: string;
}

export default async (event: AWSLambda.APIGatewayProxyEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
  const payload: Body = JSON.parse(event.body);
  const now: string = (new Date()).toISOString();
  return {
    statusCode: 200,
    body: JSON.stringify({
      id: uuid().substr(0, 8), // 8 digits should be good enough
      name: payload.name,
      created_by: 'TODO', // TODO: Is it possible for authorizer to pass username as context?
      created_date: now,
      modified_date: now,
    }),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
  };
};
