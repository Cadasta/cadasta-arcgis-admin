interface ResponseBody {
  [key: string]: any;
}
interface ErrResponseBody {
  msg: string;
  err: any;
}
interface ResponseFunction <TResponse> {
  (body: TResponse, statusCode?: number, headers?: {[key: string]: string}): AWSLambda.APIGatewayProxyResult
}
