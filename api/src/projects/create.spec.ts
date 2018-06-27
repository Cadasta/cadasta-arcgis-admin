import { APIGatewayProxyEventFactory } from '../../spec/factories';
import handler from './create';
import { create } from './db';

jest.mock('./db');

describe('Project Create API', () => {
  it('should return success response', async () => {
    const mockCreate = create as jest.Mock;
    const event: AWSLambda.APIGatewayProxyEvent = APIGatewayProxyEventFactory({name: 'Congo Project'});
    const projectData = {
      name: 'Congo Project',
      slug: 'congo-project',
      created_by: 'fakeUser',
      created_date: '2018-06-26T12:31:40.037Z',
      modified_by: 'fakeUser',
      modified_date: '2018-06-26T12:31:40.037Z'
    };
    mockCreate.mockResolvedValue(projectData);

    const response = await handler(event);
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toEqual(projectData);
  });

  it('should return server error if DB write fails', async () => {
    const mockCreate = create as jest.Mock;
    const event: AWSLambda.APIGatewayProxyEvent = APIGatewayProxyEventFactory({name: 'Congo Project'});
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