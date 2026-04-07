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
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
