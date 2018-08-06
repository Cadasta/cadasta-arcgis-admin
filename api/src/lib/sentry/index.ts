import Raven from 'raven';

const parseUser = (event: AWSLambda.APIGatewayProxyEvent): SentryUser => {
  let user;

  if (event.requestContext.authorizer) {
    const authorizerUser = JSON.parse(event.requestContext.authorizer.user);
    user = {
      email: authorizerUser.email,
      username: authorizerUser.username
    };
  }

  return user;
};

export default class SentryWrapper {
  public static handler(lambdaHandler: any) {
    Raven.config(process.env.SENTRY_DSN, {
      environment: process.env.SENTRY_ENV
    }).install();

    return async (event: AWSLambda.APIGatewayProxyEvent) => {
      try {
        return await lambdaHandler(event);  
      } catch (error) {
        const user: SentryUser = parseUser(event);

        return new Promise((resolve) => {
          Raven.captureException(error, { user }, () => {
            resolve({
              body: JSON.stringify({
                msg: 'An error has occured. Our developers have been informed'
              }),
              statusCode: 500
            });
          });
        });
      }
    };
  }
}