import { AWSError } from 'aws-sdk';

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
    // Example errors: https://docs.aws.amazon.com/AmazonSimpleDB/latest/DeveloperGuide/APIError.html
    const error: AWSError = Object.assign(new Error(), {
      message: 'The specified domain does not exist.',
      code: 'NoSuchDomain',
      statusCode: 400,
      retryable: false,
      time: new Date('2018-01-01'),
      hostname: '',
      region: 'us-west-2',
      retryDelay: 1,
      requestId: '',
      extendedRequestId: '',
      cfId: '',
    });
    mockCreate.mockRejectedValue(error);
    console.log = jest.fn()

    const response = await handler(event);

    expect(response.statusCode).toEqual(500);
    expect(JSON.parse(response.body)).toEqual({
      err: `[${error.code}] ${error.message}`,
      msg: 'Failed to create project'
    });
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
