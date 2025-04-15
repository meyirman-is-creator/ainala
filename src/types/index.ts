// src/types/index.ts
export type UserRole = "user" | "admin" | "executor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type IssueStatus = "to do" | "progress" | "review" | "done" | "reject";

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
  city?: string;
  district?: string;
  location?: {
    lat: number;
    lng: number;
  };
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

export interface City {
  id: string;
  name: string;
  districts: District[];
}

export interface District {
  id: string;
  name: string;
}
