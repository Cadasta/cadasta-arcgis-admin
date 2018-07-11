import { createGroup } from '@esri/arcgis-rest-groups';
import { ArcGISRequestError } from '@esri/arcgis-rest-request';
import 'isomorphic-fetch';
import 'isomorphic-form-data';
import { Auth } from './authentication';

interface ArcGISGroupCreationError {
  err: ArcGISRequestError;
  group: ArcGISCreateGroupRequest;
};
export interface MultipleGroupsCreationError {
  success: ArcGISGroup[],
  failure: ArcGISGroupCreationError[]
}
const groupNames: {[K in GroupNameShort]: string} = {
  project_managers: 'Project managers',
  field_supervisors: 'Field supervisors',
  data_collectors: 'Data Collectors',
  viewers: 'Viewers'
}

const isError = (obj: ArcGISGroup | ArcGISGroupCreationError): obj is ArcGISGroupCreationError => !!(obj as ArcGISGroupCreationError).err

export const createGroups = (
  groupNameKeys: GroupNameShort[],
  projectName: string,
  projectSlug: string,
  authentication: Auth
): Promise<ArcGISGroup[]> => (
  Promise.all(groupNameKeys
    // Create ArcGIS request input
    .map(
      (groupNameKey): ArcGISCreateGroupRequest => ({
        title: `${projectName}: ${groupNames[groupNameKey]}`,
        tags: [`project:${projectSlug}`],
        access: 'private',
        owner: null,
      })
    )
    // Create group-creation promises
    .map(
      (group): Promise<ArcGISGroup | ArcGISGroupCreationError> =>
        createGroup({ group, authentication, })
        .then((response: ArcGISCreateGroupResponse): ArcGISGroup => response.group)
        // If creation fails, catch errors and return object of error and offending group
        .catch((err: ArcGISRequestError) => ({ err, group }))
    )
  )
  // Combine array of successes and failures into single object
  .then(
    (responses): MultipleGroupsCreationError => responses.reduce(
      (output: MultipleGroupsCreationError, result) => ({
        success: output.success.concat(isError(result) ? [] : [result]),
        failure: output.failure.concat(isError(result) ? [result] : [])
      }),
      { success: [], failure: [] }
    )
  )
  // Reject promise if there are any errors
  .then(
    (response): ArcGISGroup[] => {
      if (response.failure.length) { throw response }
      return response.success
    }
  )
);
