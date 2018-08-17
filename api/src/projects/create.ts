import * as ArcGisPortal from '../lib/arcgis';
import * as ProjectsDb from '../lib/db/projects';
import SentryWrapper from '../lib/sentry';
import { errResponse, requiredPick, response } from '../lib/utils';

const create =  async (event: AWSLambda.APIGatewayProxyEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
  const {
    ARCGIS_REST_URL,
    TABLE_NAME: DOMAIN_NAME
  } = requiredPick(process.env, 'ARCGIS_REST_URL', 'TABLE_NAME');

  const auth = new ArcGisPortal.Auth(ARCGIS_REST_URL, event.requestContext.authorizer.authorization);
  const { name, groups: groupShortNames }: ProjectCreateRequestBody = JSON.parse(event.body);
  const user = JSON.parse(event.requestContext.authorizer.user).username;

  let project: Project;
  let groups: ArcGISGroup[] = [];
  try {
    console.log(`Creating project ${name}`);
    project = await ProjectsDb.create(DOMAIN_NAME, name, user);
  } catch (error) {
    const msg = 'Failed to create project';
    console.error(msg, JSON.stringify(error, null, 2));
    return errResponse(
      { msg, err: `[${error.code}] ${error.message}` },
      500
    );
  }

  if (groupShortNames.length) {
    try {
      console.log(`Creating groups ${groupShortNames}`);
      groups = await ArcGisPortal.createGroups(
        groupShortNames, project.name, project.slug, auth
      );
    } catch (error) {
      const msg = 'Failed to create groups';
      console.error(msg, JSON.stringify(error, null, 2));
      const err = error as ArcGisPortal.MultipleGroupsCreationError;
      // TODO: Rollback successfully created groups
      // TODO: If we don't rollback groups, we should maybe report which groups were created
      return errResponse(
        { err: err.failure.map(e => e.err.message), msg },
        500
      );
    }
  }

  return response({ project, groups }, 201);
};

export default SentryWrapper.handler(create);