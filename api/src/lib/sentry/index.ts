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
      frame.filename = 'app:///' + path.relative('/var/task/', frame.filename);
    });
  }
  return data;
};

export default class SentryWrapper {
  public static handler(lambdaHandler: any) {
    console.log(process.env.SENTRY_DSN);
    Raven.config(process.env.SENTRY_DSN, {
      dataCallback: getSourceMaps,
      environment: process.env.SENTRY_ENV,
      release: 'dev'
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