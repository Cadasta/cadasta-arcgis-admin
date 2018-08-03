import * as ArcGisPortal from '../lib/arcgis';
import * as ProjectsDb from '../lib/db/projects';
import { errResponse, requiredPick, response } from '../lib/utils';

export default async (event: AWSLambda.APIGatewayProxyEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
  const {
    ARCGIS_REST_URL,
    TABLE_NAME: DOMAIN_NAME
  } = requiredPick(process.env, 'ARCGIS_REST_URL', 'TABLE_NAME');

  const auth = new ArcGisPortal.Auth(ARCGIS_REST_URL, event.requestContext.authorizer.authorization);
  const payload: ProjectCreateRequestBody = JSON.parse(event.body);
  const user = JSON.parse(event.requestContext.authorizer.user).username;

  let project: Project;
  let groups: ArcGISGroup[];
  try {
    console.log(`Creating project ${payload.name}`);
    project = await ProjectsDb.create(DOMAIN_NAME, payload.name, user);
  } catch (error) {
    console.error(JSON.stringify(error));
    return errResponse(
      {
        err: `[${error.code}] ${error.message}`,
        msg: 'Failed to create project',
      },
      500
    );
  }

  try {
    console.log(`Creating groups ${payload.groups}`);
    groups = await ArcGisPortal.createGroups(
      payload.groups, project.name, project.slug, auth
    );
  } catch (error) {
    const e = error as ArcGisPortal.MultipleGroupsCreationError;
    console.error(JSON.stringify(e));
    // TODO: Rollback successfully created groups
    // TODO: If we don't rollback groups, we should maybe report which groups were created
    return errResponse(
      {
        err: e.failure.map(({ err }) => err.message),
        msg: 'Failed to create groups',
      },
      500
    );
  }

  return response({ project, groups }, 201);
};
