interface ResponseBody {
  [key: string]: any;
}
interface ErrResponseBody {
  msg: string;
  err: string;
}
interface ResponseFunction <TResponse> {
  (body: TResponse, statusCode?: number, headers?: {[key: string]: string}): AWSLambda.APIGatewayProxyResult
}

export const response: ResponseFunction<ResponseBody> = (body, statusCode = 200, headers = {}) => ({
  statusCode,
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    ...headers
  }
});
export const errResponse = response as ResponseFunction<ErrResponseBody>;
