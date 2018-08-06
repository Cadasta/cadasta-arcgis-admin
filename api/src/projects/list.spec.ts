import { APIGatewayProxyEventFactory, AWSErrorFactory } from '../spec/factories';

import * as ProjectsDb from '../lib/db/projects';
import * as validate from '../lib/utils/validate';

import handler from './list';

jest.mock('../lib/db/projects');
jest.mock('../lib/utils/validate');

describe('Project List API', () => {
  console.log = jest.fn(); // Disable console.log

  let consoleSpy: undefined | jest.Mock;
  const mockListProjects = ProjectsDb.list as jest.Mock;
  (validate.requiredPick as jest.Mock).mockReturnValue({
    TABLE_NAME: 'mockTableName',
  });

  beforeEach(() => {
    if (typeof consoleSpy === 'function') {
      (consoleSpy as any).mockRestore();
    }
  });

  it('should return success response', async () => {
    const projectsData: ProjectListResponse = {
      nextToken: undefined,
      results:
        [ { created_by: 'oroick',
            created_date: '2018-07-12T10:16:09.891Z',
            modified_by: 'oroick',    
            modified_date: '2018-07-12T10:16:09.891Z',
            name: 'Tata Trust Test',
            slug: 'tata-trust-test' },
          { created_by: 'factoryUser',
            created_date: '2018-07-12T15:49:20.699Z',
            modified_by: 'factoryUser',
            modified_date: '2018-07-12T15:49:20.699Z',
            name: 'My Test Project',
            slug: 'my-test-project' } ]
    };
    mockListProjects.mockResolvedValue(projectsData);

    const event = APIGatewayProxyEventFactory({ queryStringParameters: null });
    const response = await handler(event);
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(projectsData);
  });

  it('should return server error if DB read fails', async () => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => null);

    const error = AWSErrorFactory.build();
    mockListProjects.mockRejectedValue(error);
    const response = await handler(APIGatewayProxyEventFactory());

    expect(response.statusCode).toEqual(500);
    expect(JSON.parse(response.body)).toEqual({
      err: `[${error.code}] ${error.message}`,
      msg: 'Failed to list projects'
    });
    expect(console.error).toHaveBeenCalledWith(JSON.stringify(error));
  });

});
