import { createGroup } from '@esri/arcgis-rest-groups';
import { ArcGISRequestError } from '@esri/arcgis-rest-request';
import 'isomorphic-fetch';
import 'isomorphic-form-data';
import { Auth } from './authentication';

interface ArcGISGroupCreationError {
  err: ArcGISRequestError;
  group: ArcGISCreateGroupRequest;
}
export interface MultipleGroupsCreationError {
  success: ArcGISGroup[];
  failure: ArcGISGroupCreationError[];
}
const groupNames: {[K in GroupNameShort]: string} = {
  DC: 'Data Collectors',
  FS: 'Field supervisors',
  PM: 'Project managers',
  VW: 'Viewers'
};

const isError = (obj: ArcGISGroup | ArcGISGroupCreationError): 
  obj is ArcGISGroupCreationError => !!(obj as ArcGISGroupCreationError).err;

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
        access: 'private',
        owner: null,
        tags: [`project:${projectSlug}`],
        title: `${projectName}: ${groupNames[groupNameKey]}`,
      })
    )
    // Create group-creation promises
    .map(
      (group): Promise<ArcGISGroup | ArcGISGroupCreationError> => {
        console.log(`Creating group ${group}`);
        return createGroup({ group, authentication })
          .then((response: ArcGISCreateGroupResponse): ArcGISGroup => response.group)
          // If creation fails, catch errors and return object of error and offending group
          .catch((err: ArcGISRequestError) => {
            console.log(`Caught failure when trying to create ${group}: ${err}`);
            return ({ err, group })
          })
      }
    )
  )
  // Combine array of successes and failures into single object
  .then(
    (responses): MultipleGroupsCreationError => responses.reduce(
      (output: MultipleGroupsCreationError, result) => ({
        failure: output.failure.concat(isError(result) ? [result] : []),
        success: output.success.concat(isError(result) ? [] : [result])
      }),
      { success: [], failure: [] }
    )
  )
  // Reject promise if there are any errors
  .then(
    (response): ArcGISGroup[] => {
      if (response.failure.length) { throw response; }
      return response.success;
    }
  )
);
