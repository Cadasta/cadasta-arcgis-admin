import { createGroup, IGroup } from '@esri/arcgis-rest-groups';
import { IAuthenticationManager } from '@esri/arcgis-rest-request';
import 'isomorphic-fetch';
import 'isomorphic-form-data';

class Auth implements IAuthenticationManager {
  public  portal: string
  private token: string
  
  constructor(token: string) {
    this.token = token.substring(7);
  }

  public getToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve(this.token);
    });
  }
}

const groupNames: {[key: string]: string} = {
  project_managers: 'Project managers',
  field_supervisors: 'Field supervisors',
  data_collectors: 'Data Collectors',
  viewers: 'Viewers'
}
  
export async function createGroups(groups: string[], projectName: string, slug: string, owner: string, token: string) {
  let i = 0;
  const len = groups.length;
  for (i; i < len; i++) {
    const groupName: string = groupNames[groups[i]];
    const group: IGroup = {
      title: `${projectName}: ${groupName}`,
      owner,
      tags: [`project:${slug}`],
      access: 'private'
    }

    const authentication: IAuthenticationManager = new Auth(token);
    try {
      await createGroup({
        authentication,
        group,
        portal: process.env.ARCGIS_PORTAL_URL + '/rest',
      });
    } catch (e) {
      throw new Error(JSON.stringify(e.response));
    }
  }
}