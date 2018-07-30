interface User {
  modified: number;
  fullName: string;
  appInfo: {
    orgId: string;
    appId: string;
    itemId: string;
    appOwner: string;
    privileges?: string[];
    appTitle: string;
  };
  orgId: string;
  storageQuota: number;
  lastLogin: number;
  email: string;
  mfaEnabled: boolean;
  role: string;
  favGroupId: string;
  preferredView?: null;
  validateUserProfile: boolean;
  access: string;
  level: string;
  created: number;
  privileges?: string[];
  firstName: string;
  disabled: boolean;
  description: string;
  region?: null;
  culture: string;
  username: string;
  provider: string;
  idpUsername?: null;
  units: string;
  groups?: Array<{
    autoJoin: boolean;
    modified: number;
    sortOrder: string;
    isReadOnly: boolean;
    title: string;
    access: string;
    userMembership: {
      username: string;
      memberType: string;
      applications?: number | null;
    };
    sortField: string;
    id: string;
    description?: null;
    owner: string;
    protected: boolean;
    created: number;
    snippet?: string;
    providerGroupName?: null;
    provider?: null;
    capabilities?: string[];
    isViewOnly: boolean;
    isInvitationOnly: boolean;
    tags?: string[];
    isFav: boolean;
    thumbnail?: string;
    phone?: null;
  }>;
  userType: string;
  storageUsage: number;
  thumbnail: string;
  lastName: string;
  tags?: string[];
}
