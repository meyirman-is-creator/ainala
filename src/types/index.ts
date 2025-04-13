export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type IssueStatus = "to do" | "progress" | "done" | "reject";

export type IssueCategory =
  | "roads"
  | "lighting"
  | "safety"
  | "cleanliness"
  | "parks"
  | "public_transport"
  | "other";

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  category: IssueCategory;
  createdAt: string;
  updatedAt: string;
  photos: string[];
  resultPhotos?: string[];
  userId: string;
  userName: string;
  likes: number;
  comments: number;
  deadline?: string;
  assignedTo?: string;
  importance?: "low" | "medium" | "high";
  adminComment?: string;
}

export interface Comment {
  id: string;
  issueId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}
