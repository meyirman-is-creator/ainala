/**
 * Generic API response type that all endpoints return
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

/**
 * Pagination metadata returned with list endpoints
 */
export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Generic paginated response type
 */
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Common API error codes
 */
export enum ApiErrorCode {
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

/**
 * Error response with validation details
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Extended error response for validation errors
 */
export interface ValidationErrorResponse extends ApiResponse<null> {
  errors: ValidationError[];
}

/**
 * Auth-related API types
 */
export namespace AuthApi {
  export interface LoginRequest {
    email: string;
    password: string;
    remember?: boolean;
  }

  export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
  }

  export interface VerifyEmailRequest {
    email: string;
    code: string;
  }

  export interface ForgotPasswordRequest {
    email: string;
  }

  export interface ResetPasswordRequest {
    token: string;
    password: string;
    confirmPassword: string;
  }

  export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }

  export interface LoginResponse {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    token: string;
  }
}

/**
 * Issue-related API types
 */
export namespace IssuesApi {
  export interface CreateIssueRequest {
    title: string;
    description: string;
    category: string;
    photos?: string[];
    location?: {
      latitude?: number;
      longitude?: number;
      address?: string;
    };
  }

  export interface UpdateIssueRequest {
    title?: string;
    description?: string;
    category?: string;
    status?: string;
    photos?: string[];
    resultPhoto?: string;
    responsible?: {
      id: string;
      name: string;
    };
    importance?: string;
    deadline?: string;
    adminComment?: string;
    location?: {
      latitude?: number;
      longitude?: number;
      address?: string;
    };
  }

  export interface AddCommentRequest {
    content: string;
  }

  export interface IssueFilterParams {
    status?: string;
    category?: string;
    search?: string;
    importance?: string;
    startDate?: string;
    endDate?: string;
    userId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }
}

/**
 * User-related API types
 */
export namespace UsersApi {
  export interface UpdateProfileRequest {
    name?: string;
    email?: string;
    avatar?: string;
  }

  export interface UserStats {
    issuesCreated: number;
    issuesResolved: number;
    issuesInProgress: number;
    totalLikes: number;
    totalComments: number;
  }
}

/**
 * Statistics-related API types
 */
export namespace StatsApi {
  export interface IssueStats {
    totalIssues: number;
    resolvedIssues: number;
    pendingIssues: number;
    rejectedIssues: number;
    averageResolutionTime: string;
    categoryDistribution: {
      category: string;
      count: number;
      percentage: number;
    }[];
    monthlyTrends: {
      month: string;
      issues: number;
      resolved: number;
    }[];
    issuesByRegion: {
      region: string;
      count: number;
      resolved: number;
    }[];
    topReporters: {
      id: string;
      name: string;
      issuesReported: number;
      resolved: number;
    }[];
  }

  export interface StatsFilter {
    timeframe: "week" | "month" | "year";
    startDate?: string;
    endDate?: string;
    category?: string;
    region?: string;
  }
}

/**
 * File upload API types
 */
export namespace UploadApi {
  export interface UploadResponse {
    url: string;
    filename: string;
    mimetype: string;
    size: number;
  }
}

/**
 * Notification-related API types
 */
export namespace NotificationsApi {
  export interface Notification {
    id: string;
    type: "issue_update" | "comment" | "like" | "admin_action" | "system";
    message: string;
    isRead: boolean;
    createdAt: string;
    issueId?: string;
    commentId?: string;
    userId?: string;
  }

  export interface NotificationFilter {
    type?: string;
    isRead?: boolean;
    page?: number;
    limit?: number;
  }
}
