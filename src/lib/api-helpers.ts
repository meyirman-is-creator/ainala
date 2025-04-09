import { Issue, IssueStatus, IssueCategory, Comment } from "@/types/issue";
import { User } from "@/types/user";
import { ApiResponse } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Generic fetch function with error handling
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Error: ${response.status}`,
        data: null,
      };
    }

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      data: null,
    };
  }
}

// Types for fetch options
interface FetchIssuesOptions {
  userId?: string;
  status?: IssueStatus | null;
  category?: IssueCategory | null;
  search?: string;
  page?: number;
  limit?: number;
}

export interface IssuesPaginationData {
  issues: Issue[];
  pagination: {
    totalIssues: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

// Issue APIs
export async function fetchIssues(
  options: FetchIssuesOptions = {}
): Promise<ApiResponse<IssuesPaginationData>> {
  // Build query string
  const queryParams = new URLSearchParams();

  if (options.userId) queryParams.append("userId", options.userId);
  if (options.status) queryParams.append("status", options.status);
  if (options.category) queryParams.append("category", options.category);
  if (options.search) queryParams.append("search", options.search);
  if (options.page) queryParams.append("page", options.page.toString());
  if (options.limit) queryParams.append("limit", options.limit.toString());

  const endpoint = `/api/issues?${queryParams.toString()}`;

  return fetchApi<IssuesPaginationData>(endpoint);
}

export async function fetchIssueById(id: string): Promise<ApiResponse<Issue>> {
  return fetchApi<Issue>(`/api/issues/${id}`);
}

export async function createIssue(
  issueData: Partial<Issue>
): Promise<ApiResponse<Issue>> {
  return fetchApi<Issue>("/api/issues", {
    method: "POST",
    body: JSON.stringify(issueData),
  });
}

export async function updateIssueById(
  id: string,
  data: Partial<Issue>
): Promise<ApiResponse<Issue>> {
  return fetchApi<Issue>(`/api/issues/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function updateIssueStatus(
  id: string,
  status: IssueStatus,
  additionalData: any = {}
): Promise<ApiResponse<Issue>> {
  return fetchApi<Issue>(`/api/issues/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status, ...additionalData }),
  });
}

export async function deleteIssueById(id: string): Promise<ApiResponse<null>> {
  return fetchApi<null>(`/api/issues/${id}`, {
    method: "DELETE",
  });
}

export async function addCommentToIssue(
  issueId: string,
  comment: string
): Promise<ApiResponse<Comment>> {
  return fetchApi<Comment>(`/api/issues/${issueId}`, {
    method: "PATCH",
    body: JSON.stringify({
      action: "comment",
      comment,
    }),
  });
}

export async function deleteComment(
  issueId: string,
  commentId: string
): Promise<ApiResponse<null>> {
  return fetchApi<null>(`/api/issues/${issueId}/comments/${commentId}`, {
    method: "DELETE",
  });
}

export async function toggleLikeOnIssue(
  issueId: string
): Promise<ApiResponse<{ liked: boolean }>> {
  return fetchApi<{ liked: boolean }>(`/api/issues/${issueId}`, {
    method: "PATCH",
    body: JSON.stringify({ action: "like" }),
  });
}

// User APIs
export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiResponse<User>> {
  return fetchApi<User>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export async function verifyEmail(
  email: string,
  code: string
): Promise<ApiResponse<{ verified: boolean }>> {
  return fetchApi<{ verified: boolean }>("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export async function requestPasswordReset(
  email: string
): Promise<ApiResponse<{ sent: boolean }>> {
  return fetchApi<{ sent: boolean }>("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(
  token: string,
  password: string
): Promise<ApiResponse<{ success: boolean }>> {
  return fetchApi<{ success: boolean }>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

export async function updateUserData(
  userData: Partial<User>
): Promise<ApiResponse<User>> {
  return fetchApi<User>("/api/auth/user", {
    method: "PATCH",
    body: JSON.stringify(userData),
  });
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<ApiResponse<{ success: boolean }>> {
  return fetchApi<{ success: boolean }>("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

// Statistics APIs
export async function fetchStatistics(
  timeframe: "week" | "month" | "year" = "month"
): Promise<ApiResponse<any>> {
  return fetchApi<any>(`/api/statistics?timeframe=${timeframe}`);
}

// File upload helper
export async function uploadFile(
  file: File
): Promise<ApiResponse<{ url: string }>> {
  // Create form data
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      body: formData,
      // Don't set Content-Type header as the browser will set it with the boundary
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Error: ${response.status}`,
        data: null,
      };
    }

    return data;
  } catch (error) {
    console.error("File upload failed:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
      data: null,
    };
  }
}
