# Cadasta Esri Admin

This is the frontend to Cadasta's custom Esri ArcGIS Enterprise administration application.

## Development

### Project setup

In `frontend/`, run `npm install` to install required dependencies.

### Development Server

Run `npm start` to start development server. This will watch the `frontend/src` directory for changes, rebuilding the application and reloading the browser when necessary.

### Testing

Run `npm test` to start [Jest](http://jestjs.io/) test runner. This will watch the `frontend/src` directory for changes, running tests when necessary.

Run `npm test -- --coverage` to generate a coverage report.

Run `npm run validate-template` to validate CloudFormation `template.yaml` (requires available AWS credentials with appropriate permissions: `cloudformation:CreateChangeSet`, `cloudformation:ValidateTemplate`, `cloudformation:GetTemplateSummary`, `cloudformation:DescribeStacks`).

### Deployment

Steps to deployment are as follows:

1. `npm run build`, generate static website assets (located in `dist/`) that can be served as the frontend application.
2. *[optional]* `npm run deploy-stack`, (utilizes [`STAGE` environment variable](#stages)), deploy AWS infrastructure (via CloudFormation) for hosting frontend application. Only needs to be run:
    * Once per-stage per-lifetime of project.
    * When the CloudFormation template (`template.yaml`) is updated.
3. `npm run deploy`, (utilizes [`STAGE` environment variable](#stages), requires [jq](https://stedolan.github.io/jq/)), deploys static website assets (from `dist/`) to S3 bucket.
4. `npm run invalidate-cache`, (utilizes [`STAGE` environment variable](#stages), requires [jq](https://stedolan.github.io/jq/)), instruct CloudFront to clear its cache for the application, serving updated files on subsequent requests.

#### Stages

Deployment of this project looks to the `STAGE` environment variable to determine to which environment the deployment instruction applies. Valid stages are:

* `dev` (default if no `STAGE` environment variable is declared)
* `stg`
* `prod`


#### Infrastructure Architecture

The infrastructure for the frontend (e.g. S3 Bucket, CloudFronts distribution) is managed via the included CloudFormation template (`template.yaml`). Components:

* Route53 - Manages URL for application
* CloudFront - Manages SSL, provides caching-layer on top of S3 resources, ensures all requests are directed to `/index.html`
* S3 - Hosts static assets.

### CI

Travis automatically tests all PRs via `npm test` and `npm run validate-template`. Code merged into `master` is already built and deployed to the `stg` environment.

### Recommended Reading

- **Configuration**
  - [TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter): Our project was created from this starter kit. The README contains useful information regarding how React and TypeScript interact.
  - [Create React App](https://github.com/facebook/create-react-app): The aforementioned "TypeScript React Starter" is based off of this starter. The project's [User Guide](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md) contains a wealth of information about using the project and expanding your app's functionality (e.g. testing strategies, server side rendering, code splitting). This is a sensible first-step when looking to expand our applications configuration.
- **Code organization**
  - [A Better File Structure For React/Redux Applications](https://marmelab.com/blog/2015/12/17/react-directory-structure.html): Our project is organized by grouping files by domain, as described in this blogpost. This should feel more natural to someone coming from a framework such as Django.
  - [Presentation and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- **Redux**
  - [Getting Started with Redux (video series)](https://egghead.io/courses/getting-started-with-redux)
  - [Using the Redux Store Like a Database](https://hackernoon.com/shape-your-redux-store-like-your-database-98faa4754fd5)

### Code Style

**Style Rules**

- Files containing a Container and/or Component should always export their Container or Component (if no Container is available) as `default` _(Note: this [is contentious](https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html) and may change in the future)_. Files that do not export a Container or Component should have no `default` export. A file should never export more than one Container or Component.
- Filenames for files exporting a Container or Component should be uppercased. Any supporting file (e.g. `css` or `.spec.ts` files should also be uppercase). Filenames for files that do not export a Container or Component should be lowercased.
- Test files should have filenames that mirror the files they are testing, but end with `.spec.ts`

### Recommended Supported Developer Tools

* [React Developer Tools](https://github.com/facebook/react-devtools)
* [Redux DevTools Extension](http://extension.remotedev.io/)
