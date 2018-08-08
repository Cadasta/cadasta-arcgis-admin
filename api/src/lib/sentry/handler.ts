import * as path from 'path';
import Raven from 'raven';
import { errResponse } from '../utils/response';

const parseUser = (event: AWSLambda.APIGatewayProxyEvent): SentryUserInfo => {
  if (!event.requestContext.authorizer) { return; }

  const authorizerUser = JSON.parse(event.requestContext.authorizer.user);
  return {
    email: authorizerUser.email,
    username: authorizerUser.username
  };
};

const getSourceMaps: Raven.DataCallback = (data: {[key: string]: any}): {[key: string]: any} => {
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
  public static handler(lambdaHandler: LambdaHandler): LambdaHandler {
    return async (event: AWSLambda.APIGatewayProxyEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
      try {
        return await lambdaHandler(event);  
      } catch (error) {
        if (!process.env.SENTRY_DSN) {
          console.error('SENTRY_DSN not found in env. Throwing error.');
          throw error;
        }

        const user: SentryUserInfo = parseUser(event);

        Raven.config(process.env.SENTRY_DSN, {
          dataCallback: getSourceMaps,
          environment: process.env.SENTRY_ENV,
          release: process.env.RELEASE
        }).install();

        return new Promise<AWSLambda.APIGatewayProxyResult>((resolve) => {
          Raven.captureException(error, { user }, () => {
            resolve(errResponse(
              {
                err: error.message,
                msg: 'An error has occured. Our developers have been informed'
              },
              500
            ));
          });
        });
      }
    };
  }
}