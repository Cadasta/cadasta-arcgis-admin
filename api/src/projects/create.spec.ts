import {
  APIGatewayProxyEventFactory,
  ArcGISCreateGroupRequestFactory,
  ArcGISGroupFactory,
  ArcGISRequestErrorFactory,
  AWSErrorFactory,
  ProjectFactory,
} from '../spec/factories';
import * as ArcGisPortal from '../lib/arcgis';
import * as ProjectsDb from '../lib/db/projects';
import * as validate from '../lib/utils/validate';

import handler from './create';

jest.mock('../lib/db/projects');
jest.mock('../lib/arcgis/groups');
jest.mock('../lib/utils/validate');

describe('Project Create API', () => {
  console.log = jest.fn() // Disable console.log

  let consoleSpy: undefined | jest.Mock;
  const mockCreateProjects = ProjectsDb.create as jest.Mock;
  const mockCreateGroups = ArcGisPortal.createGroups as jest.Mock;
  (validate.requiredPick as jest.Mock).mockReturnValue({
    ARCGIS_REST_URL: 'mockArcGisUrl',
    TABLE_NAME: 'mockTableName',
  });
  const event: AWSLambda.APIGatewayProxyEvent = APIGatewayProxyEventFactory({
    name: 'Congo Project',
    groups: []
  });


  beforeEach(() => {
    if (typeof consoleSpy === 'function') {
      (consoleSpy as any).mockRestore();
    }
  })

  it('should return success response', async () => {
    const projectData = {
      name: 'Congo Project',
      slug: 'congo-project',
      created_by: 'fakeUser',
      created_date: '2018-06-26T12:31:40.037Z',
      modified_by: 'fakeUser',
      modified_date: '2018-06-26T12:31:40.037Z'
    };
    const groupData = ArcGISGroupFactory.build();
    mockCreateProjects.mockResolvedValue(projectData);
    mockCreateGroups.mockResolvedValue(groupData);

    const response = await handler(event);
    expect(response.statusCode).toEqual(201);
    expect(JSON.parse(response.body)).toEqual({ project: projectData, groups: groupData });
  });

  it('should return server error if DB write fails', async () => {
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => null)

    const error = AWSErrorFactory.build();
    mockCreateProjects.mockRejectedValue(error);

    const response = await handler(event);

    expect(response.statusCode).toEqual(500);
    expect(JSON.parse(response.body)).toEqual({
      err: `[${error.code}] ${error.message}`,
      msg: 'Failed to create project'
    });
    expect(console.error).toHaveBeenCalledWith(JSON.stringify(error));
  });

  it('should return server error if DB write fails', async () => {
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => null)

    const project = ProjectFactory.build();
    mockCreateProjects.mockResolvedValue(project);

    const createGroupsErrorResponse: ArcGisPortal.MultipleGroupsCreationError = {
      success: [
        ArcGISGroupFactory.build(),
        ArcGISGroupFactory.build()
      ],
      failure: [
        {err: ArcGISRequestErrorFactory.build(), group: ArcGISCreateGroupRequestFactory.build()},
        {err: ArcGISRequestErrorFactory.build(), group: ArcGISCreateGroupRequestFactory.build()},
      ]
    }
    mockCreateGroups.mockRejectedValue(createGroupsErrorResponse);

    const response = await handler(event);
    expect(response.statusCode).toEqual(500);
    expect(JSON.parse(response.body)).toEqual({
      msg: 'Failed to create groups',
      err: [
        "COM_0044: Unable to create group.",
        "COM_0044: Unable to create group."
      ]
    });
    expect(console.error).toHaveBeenCalledWith(JSON.stringify(createGroupsErrorResponse));
  });
});
