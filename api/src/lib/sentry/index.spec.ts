import Raven from 'raven';
import { APIGatewayProxyEventFactory } from '../../spec/factories';
import { errResponse, response } from '../utils/response';
import SentryWrapper from './index';

jest.mock('raven', () => {
  return {
    captureException: jest.fn((err: Error, opts: Raven.CaptureOptions, cb: Raven.CaptureCallback) => { cb(err, 123); }),
    config: jest.fn().mockReturnValue({ install: jest.fn() })
  };
});

describe('SentryWrapper', () => {
  const event: AWSLambda.APIGatewayProxyEvent = APIGatewayProxyEventFactory();
  let consoleSpy: undefined | jest.Mock;

  beforeEach(() => {
    if (typeof consoleSpy === 'function') {
      (consoleSpy as any).mockRestore();
    }
  });

  afterEach(() => {
    delete process.env.SENTRY_DSN;
  });

  it('should return the response from the lambda handler', async () => {
    const expectedResponse = response({msg: 'Test message'});
    const lambdaHandler = () => {
      return new Promise<AWSLambda.APIGatewayProxyResult>((resolve) => {
        resolve(expectedResponse);
      });
     };

    const wrapped = SentryWrapper.handler(lambdaHandler);
    expect(await wrapped(event)).toEqual(expectedResponse);
  });

  it('should throw the error if SENTRY_DSN is not in env', async () => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => null);

    const error = new Error('Test Error');
    const lambdaHandler = () => { throw error; };

    const wrapped = SentryWrapper.handler(lambdaHandler);
    try {
      await wrapped(event);
    } catch (e) {
      expect(e).toEqual(error);
      expect(console.error).toHaveBeenCalledWith('SENTRY_DSN not found in env. Throwing error.');
    }
  });

  it('should catch the error and resolve with a HTTP 500 response', async () => {
    process.env.SENTRY_DSN = 'https://example.com';

    const error = new Error('Test Error');
    const expectedResponse = errResponse(
      {
        err: error.message,
        msg: 'An error has occured. Our developers have been informed'
      },
      500
    );
    const lambdaHandler = () => { throw error; };
    const wrapped = SentryWrapper.handler(lambdaHandler);
    expect(await wrapped(event)).toEqual(expectedResponse);
  });
});