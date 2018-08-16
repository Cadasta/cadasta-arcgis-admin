interface SentryUserInfo {
  email: string;
  username: string;
}

type LambdaHandler = (event: AWSLambda.APIGatewayProxyEvent) => Promise<AWSLambda.APIGatewayProxyResult>;