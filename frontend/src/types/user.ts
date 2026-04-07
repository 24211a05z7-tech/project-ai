export enum UserRole {
  TEAM_LEADER = 'team_leader',
  MEMBER = 'member',
  GUIDE = 'guide',
  PANEL_MEMBER = 'panel_member',
}

export interface User {
  id: string;
  name: string;
  email: string;
  /** Primary role (first element of the roles array). May be absent on older records. */
  role?: UserRole;
  /** All roles assigned to the user (matches backend `roles: UserRole[]`). */
  roles: UserRole[];
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
