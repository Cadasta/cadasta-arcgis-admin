import { SimpleDB } from 'aws-sdk';
import { mockAwsMethodPromiseObject, ProjectFactory } from '../../spec';
import * as ProjectsDb from './projects';

const convertProjectToSimpleDbItem = (project: Project): SimpleDB.Item => ({
  Attributes: Object.entries(project).map(([Name, Value]) => ({ Name, Value })),
  Name: project.slug
});

jest.mock('aws-sdk');
const MockSimpleDB = (SimpleDB as any) as jest.MockInstance<SimpleDB>;
console.log = jest.fn(); // mute console.log

describe('ProjectsDb.create()', () => {
  let timeNow: Date;
  const realDate = Date;

  beforeEach(() => {
    MockSimpleDB.mockClear();

    timeNow = new Date();
    const _GLOBAL: any = global;
    _GLOBAL.Date = class {
      constructor() {
        return timeNow;
      }
    };
  });

  afterAll(() => {
    global.Date = realDate;
  });

  it('should return a Project object', async () => {
    const mock = mockAwsMethodPromiseObject({ putAttributes: jest.fn().mockResolvedValue(true) });
    MockSimpleDB.mockImplementation(() => mock);

    const name = 'Test Project';
    const slug = 'test-project';
    const username = 'myUsername';
    const DomainName = 'testDomain';

    expect(
      await ProjectsDb.create(DomainName, name, username)
    ).toEqual({
      created_by: username,
      created_date: timeNow.toISOString(),
      modified_by: username,
      modified_date: timeNow.toISOString(),
      name,
      slug
    });
    expect(MockSimpleDB).toHaveBeenCalledTimes(1); // Instantiated
    expect(mock.putAttributes).toHaveBeenCalledTimes(1);
    expect(mock.putAttributes).toHaveBeenCalledWith({
      Attributes: [
        {Name: 'slug', Value: 'test-project'},
        {Name: 'name', Value: 'Test Project'},
        {Name: 'created_by', Value: username},
        {Name: 'modified_by', Value: username},
        {Name: 'created_date', Value: timeNow.toISOString()},
        {Name: 'modified_date', Value: timeNow.toISOString()}
      ],
      DomainName,
      Expected: {
        Exists: false,
        Name: 'slug'
      },
      ItemName: slug
    });
  });

  it('should handle already-existing slugs', async () => {
    const mock = mockAwsMethodPromiseObject({
      putAttributes: jest.fn()
        .mockRejectedValueOnce({code: 'ConditionalCheckFailed'})
        .mockRejectedValueOnce({code: 'ConditionalCheckFailed'})
        .mockResolvedValue(true)
    });
    MockSimpleDB.mockImplementation(() => mock);

    const name = 'Test Project';
    const finalSlug = 'test-project-2';
    const username = 'myUsername';
    const DomainName = 'testDomain';

    expect(
      await ProjectsDb.create(DomainName, name, username)
    ).toEqual({
      created_by: username,
      created_date: timeNow.toISOString(),
      modified_by: username,
      modified_date: timeNow.toISOString(),
      name,
      slug: finalSlug
    });
    expect(MockSimpleDB).toHaveBeenCalledTimes(1); // Instantiated
    expect(mock.putAttributes).toHaveBeenCalledTimes(3);
    expect(mock.putAttributes.mock.calls).toEqual(
      ['test-project', 'test-project-1', 'test-project-2'].map(slug => [{
        Attributes: [
          {Name: 'slug', Value: slug},
          {Name: 'name', Value: 'Test Project'},
          {Name: 'created_by', Value: username},
          {Name: 'modified_by', Value: username},
          {Name: 'created_date', Value: timeNow.toISOString()},
          {Name: 'modified_date', Value: timeNow.toISOString()}
        ],
        DomainName,
        Expected: {
          Exists: false,
          Name: 'slug'
        },
        ItemName: slug
      }])
    );
  });
});

describe('ProjectsDb.list()', () => {

  beforeEach(() => {
    MockSimpleDB.mockClear();
  });

  it('should list returned projects', async () => {
    const projects = ProjectFactory.buildList(10);
    const response: SimpleDB.SelectResult = {
      Items: projects.map(convertProjectToSimpleDbItem)
    };
    const mock = mockAwsMethodPromiseObject({
      select: jest.fn().mockResolvedValue(response)
    });
    MockSimpleDB.mockImplementation(() => mock);

    expect(await ProjectsDb.list('testDomain')).toEqual({
      nextToken: undefined,
      results: projects
    });
    expect(MockSimpleDB).toHaveBeenCalledTimes(1); // Instantiated
    expect(mock.select).toHaveBeenCalledTimes(1);
    expect(mock.select).toHaveBeenCalledWith({
      SelectExpression: 'select * from `testDomain`'
    });
  });

  it('should return NextTokens', async () => {
    const projects = ProjectFactory.buildList(10);
    const response: SimpleDB.SelectResult = {
      Items: projects.map(convertProjectToSimpleDbItem),
      NextToken: 'abc'
    };
    const mock = mockAwsMethodPromiseObject({
      select: jest.fn().mockResolvedValue(response)
    });
    MockSimpleDB.mockImplementation(() => mock);

    expect(await ProjectsDb.list('testDomain')).toEqual({
      nextToken: 'abc',
      results: projects
    });
    expect(MockSimpleDB).toHaveBeenCalledTimes(1); // Instantiated
    expect(mock.select).toHaveBeenCalledTimes(1);
    expect(mock.select).toHaveBeenCalledWith({
      SelectExpression: 'select * from `testDomain`'
    });
  });

  it('should query with provided NextTokens', async () => {
    const projects = ProjectFactory.buildList(10);
    const response: SimpleDB.SelectResult = {
      Items: projects.map(convertProjectToSimpleDbItem)
    };
    const mock = mockAwsMethodPromiseObject({
      select: jest.fn().mockResolvedValue(response)
    });
    MockSimpleDB.mockImplementation(() => mock);

    expect(await ProjectsDb.list('testDomain', 'xyz')).toEqual({
      nextToken: undefined,
      results: projects
    });
    expect(MockSimpleDB).toHaveBeenCalledTimes(1); // Instantiated
    expect(mock.select).toHaveBeenCalledTimes(1);
    expect(mock.select).toHaveBeenCalledWith({
      NextToken: 'xyz',
      SelectExpression: 'select * from `testDomain`'
    });
  });
});
