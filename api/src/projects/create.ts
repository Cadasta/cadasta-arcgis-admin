import * as ArcGisPortal from '../lib/arcgis';
import * as ProjectsDb from '../lib/db/projects';
import { buildResponse } from '../lib/utils';

export default async (event: AWSLambda.APIGatewayProxyEvent): Promise<AWSLambda.APIGatewayProxyResult> => {
  const ARCGIS_REST_URL = process.env.ARCGIS_REST_URL;

  const auth = new ArcGisPortal.Auth(ARCGIS_REST_URL, event.requestContext.authorizer.authorization);
  const payload: ProjectCreateRequestBody = JSON.parse(event.body);
  const user = JSON.parse(event.requestContext.authorizer.user).username;

  let project: Project;
  let groups: ArcGisPortal.ParallelOpResult;
  try {
    project = await ProjectsDb.create(payload.name, user);
  } catch (error) {
    console.log(error);
    return buildResponse({
      msg: 'Failed to create project',
      err: `[${error.code}] ${error.message}`,
    }, 500);
  }

  try {
    const groupsResult = await ArcGisPortal.createGroups(
      payload.groups, project.name, project.slug, user, auth
    );
  } catch (error) {


  }

  return buildResponse(project);
};
