import * as path from 'path';
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

const getSourceMaps = (data: any) => {
  const stacktrace: any = data.exception && data.exception[0].stacktrace;
  if (stacktrace && stacktrace.frames) {
    stacktrace.frames.forEach((frame: any) => {
      const p = path.relative('/var/task/', frame.filename);
      frame.filename = 'app:///' + p.split('/')[0] + '/' + p;
    });
  }
  return data;
};

export default class SentryWrapper {
  public static handler(lambdaHandler: any) {
    return async (event: AWSLambda.APIGatewayProxyEvent) => {
      try {
        return await lambdaHandler(event);  
      } catch (error) {
        if (!process.env.SENTRY_DSN) {
          console.error('SENTRY_DSN not found in env. Throwing error.');
          throw error;
        }

        const user: SentryUser = parseUser(event);

        Raven.config(process.env.SENTRY_DSN, {
          dataCallback: getSourceMaps,
          environment: process.env.SENTRY_ENV,
          release: process.env.RELEASE
        }).install();

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