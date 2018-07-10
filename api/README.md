# ArcGIS Admin API

## Commands

* `npm start`
* `npm test`
* `npm test -- --watch`
* `npm run build`
* `npm run package`
* `npm run deploy`

## Development

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

Install [`aws-sam-cli`](https://github.com/awslabs/aws-sam-cli)

### Deploy steps

1. `npm run build` Builds the Lambda functions
2. `npm run package` Packages local artifacts, which are referenced in `template.yaml`
3. `npm run deploy` Deploys the stack to AWS
