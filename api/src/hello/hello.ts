export default async (
  event: AWSLambda.APIGatewayProxyEvent,
): Promise<AWSLambda.APIGatewayProxyResult> => ({
  body: JSON.stringify({
    authorizer: {
      user: JSON.parse(event.requestContext.authorizer.user),
      username: event.requestContext.authorizer.principalId
    },
    msg: 'Hello world',
  }),
  statusCode: 200,
});
