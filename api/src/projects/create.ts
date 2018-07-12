import * as ArcGisPortal from '../lib/arcgis';
import * as ProjectsDb from '../lib/db/projects';
import { response, errResponse } from '../lib/utils';

export default async (event: AWSLambda.APIGatewayProxyEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
  const ARCGIS_REST_URL = process.env.ARCGIS_REST_URL;
  const DomainName =  process.env.TABLE_NAME;

  const auth = new ArcGisPortal.Auth(ARCGIS_REST_URL, event.requestContext.authorizer.authorization);
  const payload: ProjectCreateRequestBody = JSON.parse(event.body);
  const user = JSON.parse(event.requestContext.authorizer.user).username;

  let project: Project;
  let groups: ArcGISGroup[];
  try {
    project = await ProjectsDb.create(DomainName, payload.name, user);
  } catch (error) {
    console.log(JSON.stringify(error));
    return errResponse({
      msg: 'Failed to create project',
      err: `[${error.code}] ${error.message}`,
    }, 500);
  }

  try {
    groups = await ArcGisPortal.createGroups(
      payload.groups, project.name, project.slug, auth
    );
  } catch (error) {
    let err = error as ArcGisPortal.MultipleGroupsCreationError
    console.log(JSON.stringify(err));
    // TODO: Rollback successfully created groups
    // TODO: If we don't rollback groups, we should maybe report which groups were created
    return errResponse({
      msg: 'Failed to create groups',
      err: err.failure.map(({ err }) => err.message),
    }, 500);
  }

  return response({ project, groups }, 201);
};
