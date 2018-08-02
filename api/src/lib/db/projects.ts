import { SimpleDB } from "aws-sdk";
import slugify from "slugify";

export async function create(
  DomainName: string,
  name: string,
  username: string
): Promise<Project> {
  const simpledb = new SimpleDB();
  const slug: string = slugify(name).toLowerCase();

  let proposedSlug: string = slug;
  let count = 0;

  while (true) {
    const now: string = new Date().toISOString();
    const params = {
      Attributes: [
        { Name: "slug", Value: proposedSlug },
        { Name: "name", Value: name },
        { Name: "created_by", Value: username },
        { Name: "modified_by", Value: username },
        { Name: "created_date", Value: now },
        { Name: "modified_date", Value: now }
      ],
      DomainName,
      ItemName: proposedSlug,
      Expected: {
        Exists: false,
        Name: "slug"
      }
    };
    try {
      console.log(
        "simpledb.putAttributes Response:",
        JSON.stringify(await simpledb.putAttributes(params).promise())
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
      console.log("simpledb.putAttributes Failure:", error);
      if (error.code === "ConditionalCheckFailed") {
        count++;
        proposedSlug = slug + "-" + count;
      } else {
        throw error;
      }
    }
  }
}

export async function list(
  DomainName: string,
  next?: string
): Promise<ProjectListResponse> {
  const simpledb = new SimpleDB();
  const params: SimpleDB.SelectRequest = {
    SelectExpression: `select * from \`${DomainName}\``,
    ...(next ? { NextToken: next } : {})
  };
  console.log(`Querying SimpleDB: ${JSON.stringify(params, null, 2)}`);
  const resp = await simpledb.select(params).promise();
  return {
    results: resp.Items.map(
      item =>
        item.Attributes.reduce(
          (obj, attr) => Object.assign(obj, { [attr.Name]: attr.Value }),
          {}
        ) as Project
    ),
    nextToken: resp.NextToken
  };
}
