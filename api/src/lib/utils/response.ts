export const buildResponse = (body: {[key: string]: any}, statusCode = 200, headers = {}): AWSLambda.APIGatewayProxyResult => ({
  statusCode,
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    ...headers
  },
})
