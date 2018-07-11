import AWS from 'aws-sdk';
import slugify from 'slugify';

export async function create(DomainName: string, name: string, username: string): Promise<Project> {
  const simpledb = new AWS.SimpleDB();
  const slug: string = slugify(name).toLowerCase();

  let proposedSlug: string = slug;
  let count = 0;

  while (true) {
    const now: string = new Date().toISOString();
    const params = {
      Attributes: [
        {Name: 'slug', Value: proposedSlug},
        {Name: 'name', Value: name},
        {Name: 'created_by', Value: username},
        {Name: 'modified_by', Value: username},
        {Name: 'created_date', Value: now},
        {Name: 'modified_date', Value: now}
      ],
      DomainName,
      ItemName: proposedSlug,
      Expected: {
        Exists: false,
        Name: 'slug'
      }
    };
    try {
      console.log(
        await simpledb.putAttributes(params).promise()
      );
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
        throw error;
      }
    }
  }
}
