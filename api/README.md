# ArcGIS Admin API

## Commands

* `npm start`
* `npm test`
* `npm test -- --watch`
* `npm run build`
* `npm run package`
* `npm run deploy`

## Deploy

### Prerequisites

Install [`aws-sam-cli`](https://github.com/awslabs/aws-sam-cli)

### Deploy steps

1. `npm run build` Builds the Lambda functions
2. `npm run package` Packages local artifacts, which are referenced in `template.yaml`
3. `npm run deploy` Deploys the stack to AWS
