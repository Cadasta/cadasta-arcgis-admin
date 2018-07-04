import { createGroup, IGroup } from '@esri/arcgis-rest-groups';
import { ArcGISRequestError } from '@esri/arcgis-rest-request';
import 'isomorphic-fetch';
import 'isomorphic-form-data';
import Auth from './authentication';

const groupNames: {[key: string]: string} = {
  project_managers: 'Project managers',
  field_supervisors: 'Field supervisors',
  data_collectors: 'Data Collectors',
  viewers: 'Viewers'
}

interface ParallelOpResult {
  success: Array<{[key: string]: any}>,
  failure: ArcGISRequestError[]
}

export const createGroups = (
  groups: string[],
  projectName: string,
  slug: string,
  owner: string,
  token: string
): Promise<ParallelOpResult> => (
  Promise.all(groups
    // Create ArcGIS request input
    .map(
      (group: string): IGroup => ({
        title: `${projectName}: ${groupNames[group]}`,
        owner,
        tags: [`project:${slug}`],
        access: 'private'
      })
    )
    // Create group-creation promises
    .map(
      (group: IGroup) => createGroup({
        group,
        authentication: new Auth(token),
        portal: process.env.ARCGIS_PORTAL_URL + '/rest'
      })
      // Catch errors, return as error object
      .catch((err: ArcGISRequestError) => ({ err, group }))
    )
  )
  // Combine array of successes and failures into single object
  .then(
    (responses): ParallelOpResult =>
    responses.reduce(
      (output: ParallelOpResult, result) => ({
        success: output.success.concat(!result.err ? [result] : []),
        failure: output.failure.concat(result.err ? [result] : [])
      }),
      { success: [], failure: [] }
    )
  )
);
  
// export async function createGroups(groups: string[], projectName: string, slug: string, owner: string, token: string) {
//   for (const g of groups) {
//     const groupName: string = groupNames[g];
//     const group: IGroup = {
//       title: `${projectName}: ${groupName}`,
//       owner,
//       tags: [`project:${slug}`],
//       access: 'private'
//     }

//     const authentication: IAuthenticationManager = new Auth(token);
//     try {
//       await createGroup({
//         authentication,
//         group,
//         portal: process.env.ARCGIS_PORTAL_URL + '/rest',
//       });
//     } catch (e) {
//       throw new Error(JSON.stringify(e.response));
//     }
//   }
// }