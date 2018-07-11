type GroupNameShort = 'project_managers' | 'field_supervisors' | 'data_collectors' | 'viewers';

interface ArcGISCreateGroupRequest {
  title: string;
  access: 'private' | 'org' | 'public';
  description?: string;
  snippet?: string;
  tags: string[];
  phone?: string;
  sortField?: 'title' | 'owner' | 'avgrating' | 'numviews' | 'created' | 'modified';
  sortOrder?: 'asc' | 'desc';
  isViewOnly?: boolean;
  isInvitationOnly?: boolean;
  thumbnail?: string;
  autoJoin?: boolean;
  owner: null; // This is never actually used, see https://github.com/Esri/arcgis-rest-js/issues/241
}

interface ArcGISCreateGroupResponse {
  success: boolean;
  group: ArcGISGroup;
}

// https://developers.arcgis.com/rest/users-groups-and-items/group.htm
interface ArcGISGroup {
  title: string;
  id: string;
  isInvitationOnly: boolean;
  owner: string;
  description?: string;
  snippet?: string;
  tags: string[];
  phone?: string;
  sortField?: 'title' | 'owner' | 'avgrating' | 'numviews' | 'created' | 'modified';
  sortOrder?: 'asc' | 'desc';
  isViewOnly: boolean;
  isFav: boolean;
  thumbnail?: string;
  created: number;
  modified: number;
  access: 'private' | 'org' | 'public';
  protected: boolean;
  autoJoin: boolean;
  // "isReadOnly": false,
  // "capabilities": [],
  // "provider": null,
  // "providerGroupName": null,
}
