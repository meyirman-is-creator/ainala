export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  isVerified: boolean;
  stats?: {
    issuesCreated: number;
    issuesResolved: number;
    issuesInProgress: number;
  };
}

export interface UserCredentials {
  email: string;
  password: string;
}
