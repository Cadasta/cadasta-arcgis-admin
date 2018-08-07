# ArcGIS Admin API

## Commands

* `npm start`
* `npm test`
* `npm test -- --watch`
* `npm run build`
* `npm run package`
* `npm run deploy`
* `npm run dev-server`

## Development

### Functional Testing

#### API Server

A development server can be run with the `dev-server` command. This is a wrapper around [`sam local start-api`](https://github.com/awslabs/aws-sam-cli#user-content-run-api-gateway-locally) that auto-reloads when the contents of `dist` changes. The dev server requires that a `env.json` file be present, providing all required environment variables. The downside of this approach is that **the development server does not make use of our authorizer, meaning that the authorization token will not be set within the `APIGatewayProxyEvent.requestContext`.** If you need to test an API endpoint that makes use of the authorization token (e.g. to make a request to our ArcGIS Server Portal), it is recommended to invoke the function manually.

#### Invoking Functions

SAM provides a command to invoke a function manually via `sam local invoke [FunctionName]`. This requires the input of a JSON event object that will be passed to the Lamdba function. The `generate-event` script is designed to assist in the generation of these events:

```sh
$ ./generate-event api --body '{"foo": "bar"}' --token "abcd123" | sam local invoke ProjectsCreate -n env.json
```

As a convenience, the `generate-event` script passes the current environment's `TOKEN` environment variable (if set) by default, however this can be overridden with the `--token` argument.

_Note: SAM also provides a helper to generate API events: [`sam local generate-event api`](https://github.com/awslabs/aws-sam-cli#user-content-generate-sample-event-source-payloads), however at time of writing it does not provide an option the enhanced context in `APIGatewayProxyEvent.requestContext` (i.e. we can not simulate our authorizer's insertion of an authorization token into the `APIGatewayProxyEvent.requestContext`). Once this feature becomes available, utilizing `sam local generate-event` will likely become the recommended way to generaate events._

### Code Organization

#### Environment Variables

Custom per-environment configuration is provided to the application via environment variables. For the sake of organization, all enviroment variables should be accessed within the Lambda handler function (and passed as arguments to functions and classes that depend on the configuration, if needed). This provides us with the following benefites: 

1. It makes it obvious as to which environment variables need to be set for any given Lambda function; 
2. It simplifies mocking configuration when writing tests.

### Expected Behaviour

#### 4xx Responses

[4xx Client errors](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#4xx_Client_errors) should respond in the following structure:

```
{
  "msg": [Human-readable text describing what client did incorrectly, suitable for rendering on front-end],
}
```

#### 5xx Responses

```
{
  "msg": [Human-readable text describing what went wrong, suitable for rendering on front-end],
  "err": [Technical description for purposes of debugging]
}
```

## Deploy

### Prerequisites

- Install [`aws-sam-cli`](https://github.com/awslabs/aws-sam-cli)
- Deployment uploads source maps to Sentry for error tracking; we need to configure `.sentryclirc`: 
  1. Copy `.sentryclirc.example` to `.sentryclirc`
  2. [Create a new API token](https://sentry.io/settings/account/api/auth-tokens/) for your account; make sure it has `project:write` permission
  3. Add the token to `.sentryclirc` under `[auth]`
- The Lambda functions need to be configured with the required env variables:
  1. Copy `.env.example` to `.env`
  2. Get the [Sentry DSN](https://sentry.io/settings/cadasta/arcgis-admin/keys/).
  3. Add the DSN to the `.env` config

### Deploy steps

1. `npm run build` Builds the Lambda functions
2. `npm run package` Packages local artifacts, which are referenced in `template.yaml`
3. `npm run deploy` Deploys the stack to AWS
