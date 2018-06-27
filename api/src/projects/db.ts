import AWS from 'aws-sdk';
import slugify from 'slugify';

function makeParams(name: string, slug: string, username: string, date: string) {
  return {
    Attributes: [
      {Name: 'slug', Value: slug},
      {Name: 'name', Value: name},
      {Name: 'created_by', Value: username},
      {Name: 'modified_by', Value: username},
      {Name: 'created_date', Value: date},
      {Name: 'modified_date', Value: date}
    ],
    DomainName: process.env.TABLE_NAME,
    ItemName: slug,
    Expected: {
      Exists: false,
      Name: 'slug'
    }
  };
}

export async function create(name: string, username: string): Promise<ProjectResponseBody> {
  const simpledb = new AWS.SimpleDB();
  const slug: string = slugify(name).toLowerCase();

  let proposedSlug: string = slug;
  let count = 0;

  while (true) {
    const now: string = (new Date()).toISOString();
    const params = makeParams(name, proposedSlug, username, now);

    try {
      await simpledb.putAttributes(params).promise();

      return {
        name,
        slug: proposedSlug,
        created_by: username,
        created_date: now,
        modified_by: username,
        modified_date: now
      };
    } catch (error) {
      if (error.code === 'ConditionalCheckFailed') {
        count++;
        proposedSlug = slug + '-' + count;
      } else {
        throw new Error(JSON.stringify(error));
      }
    }
  }
}