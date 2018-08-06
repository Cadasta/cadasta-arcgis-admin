interface ResponseBody {
  [key: string]: any;
}
interface ErrResponseBody {
  msg: string;
  err: any;
}
type ResponseFunction <TResponse> = 
  (body: TResponse, statusCode?: number, headers?: {[key: string]: string}) => AWSLambda.APIGatewayProxyResult;

export const response: ResponseFunction<ResponseBody> = (body, statusCode = 200, headers = {}) => ({
  body: JSON.stringify(body),
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    ...headers
  },
  statusCode
});
export const errResponse = response as ResponseFunction<ErrResponseBody>;
