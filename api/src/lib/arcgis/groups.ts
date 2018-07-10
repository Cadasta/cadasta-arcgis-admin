import { createGroup, IGroup } from '@esri/arcgis-rest-groups';
import { ArcGISRequestError } from '@esri/arcgis-rest-request';
import 'isomorphic-fetch';
import 'isomorphic-form-data';
import { Auth } from './authentication';

export interface ParallelOpResult {
  success: Array<{[key: string]: any}>,
  failure: ArcGISRequestError[]
}
const groupNames: {[K in GroupNameShort]: string} = {
  project_managers: 'Project managers',
  field_supervisors: 'Field supervisors',
  data_collectors: 'Data Collectors',
  viewers: 'Viewers'
}

export const createGroups = (
  groupNameKeys: GroupNameShort[],
  projectName: string,
  projectSlug: string,
  owner: string,
  authentication: Auth
): Promise<ParallelOpResult> => (
  Promise.all(groupNameKeys
    // Create ArcGIS request input
    .map(
      (groupNameKey): IGroup => ({
        title: `${projectName}: ${groupNames[groupNameKey]}`,
        owner,
        tags: [`project:${projectSlug}`],
        access: 'private'
      })
    )
    // Create group-creation promises
    .map(
      (group: IGroup) => createGroup({
        group,
        authentication,
      })
      // Catch errors, return as error object
      .catch((err: ArcGISRequestError) => ({ err, group }))
    )
  )
  // Combine array of successes and failures into single object
  .then(
    (responses): ParallelOpResult => responses.reduce(
      (output: ParallelOpResult, result) => ({
        success: output.success.concat(!result.err ? [result] : []),
        failure: output.failure.concat(result.err ? [result] : [])
      }),
      { success: [], failure: [] }
    )
  )
  // Reject promise if there are any errors
  .then(
    (response): ParallelOpResult => {
      if (response.failure.length) { throw response }
      return response
    }
  )
);
