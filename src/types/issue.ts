export type IssueStatus = "to-do" | "progress" | "done" | "rejected";

export type IssueCategory =
  | "roads"
  | "energy-supply"
  | "water-supply"
  | "network"
  | "public-transport"
  | "ecology"
  | "safety"
  | "csc";

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface IssueResponsible {
  id: string;
  name: string;
  avatar?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  photos: string[];
  resultPhoto?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  likes: number;
  liked?: boolean;
  comments?: Comment[];
  importance?: "low" | "medium" | "high";
  deadline?: string;
  responsible?: IssueResponsible;
  adminComment?: string;
}
