export default async (
  event: AWSLambda.APIGatewayProxyEvent,
): Promise<AWSLambda.APIGatewayProxyResult> => ({
  statusCode: 200,
  body: JSON.stringify({
    msg: 'Hello world',
    authorizer: {
      username: event.requestContext.authorizer.principalId,
      user: JSON.parse(event.requestContext.authorizer.user)
    }
  })
});
