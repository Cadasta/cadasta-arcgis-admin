import SentryWrapper from '../lib/sentry';

const hello = async (
  event: AWSLambda.APIGatewayProxyEvent,
): Promise<AWSLambda.APIGatewayProxyResult> => {
  console.log('Watch out an error will occur');
  throw new Error('An Error happened');
};

// ({
//   statusCode: 200,
//   body: JSON.stringify({
//     msg: 'Hello world',
//     // authorizer: {
//     //   username: event.requestContext.authorizer.principalId,
//     //   user: JSON.parse(event.requestContext.authorizer.user)
//     // }
//   })
// });

export default SentryWrapper.handler(hello);
