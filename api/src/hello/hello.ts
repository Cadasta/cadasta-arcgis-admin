import SentryWrapper from '../lib/sentry';

const hello = async (
  event: AWSLambda.APIGatewayProxyEvent,
): Promise<AWSLambda.APIGatewayProxyResult> => {
  if (event.queryStringParameters && event.queryStringParameters.error) {
    throw new Error('An Error happened');
  }

  return {
    body: JSON.stringify({
      authorizer: {
        user: JSON.parse(event.requestContext.authorizer.user),
        username: event.requestContext.authorizer.principalId
      },
      msg: 'Hello world'
    }),
    statusCode: 200
  };
};

export default SentryWrapper.handler(hello);
