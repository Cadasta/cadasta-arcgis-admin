import { APIGatewayProxyEventFactory } from '../../spec/factories';
import { createGroups } from '../lib/arcgis/groups';
import { create } from '../lib/db/projects';
import handler from './create';

jest.mock('../lib/db/projects');
jest.mock('../lib/arcgis/groups');

describe('Project Create API', () => {
  const mockCreate = create as jest.Mock;
  const mockCreateGroups = createGroups as jest.Mock;
  const event: AWSLambda.APIGatewayProxyEvent = APIGatewayProxyEventFactory({
    name: 'Congo Project',
    groups: []
  });

  it('should return success response', async () => {
    const projectData = {
      name: 'Congo Project',
      slug: 'congo-project',
      created_by: 'fakeUser',
      created_date: '2018-06-26T12:31:40.037Z',
      modified_by: 'fakeUser',
      modified_date: '2018-06-26T12:31:40.037Z'
    };
    mockCreate.mockResolvedValue(projectData);
    mockCreateGroups.mockResolvedValue({});

    const response = await handler(event);
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(projectData);
  });

  it('should return server error if DB write fails', async () => {
    const error = {
      code: 'SomeError',
      statusCode: 409
    };
    mockCreate.mockRejectedValue(new Error(JSON.stringify(error)));
    const response = await handler(event);
    expect(response.statusCode).toEqual(500);
    expect(JSON.parse(response.body)).toEqual(error);
  });
});