// URLS
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
export const API_URL = `${APP_URL}/api`;

// AUTH
export const TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

// PAGINATION
export const DEFAULT_PAGE_SIZE = 9;
export const DEFAULT_PAGE = 1;

// ROUTES
export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  VERIFY_EMAIL: "/verify-email",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  ADD_ISSUE: "/add-issues",
  MY_ISSUES: "/my-issues",
  ISSUE_DETAILS: "/issue-details",
  ISSUE: (id: string) => `/issue/${id}`,
  ADMIN: {
    ALL_ISSUES: "/admin/all-issues",
    STATISTICS: "/admin/statistics",
  },
};

// API ENDPOINTS
export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: "/api/auth/signin",
    SIGN_UP: "/api/auth/signup",
    VERIFY_EMAIL: "/api/auth/verify-email",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
  },
  ISSUES: {
    LIST: "/api/issues",
    DETAIL: (id: string) => `/api/issues/${id}`,
    COMMENTS: (id: string) => `/api/issues/${id}/comments`,
    LIKE: (id: string) => `/api/issues/${id}/like`,
  },
  USERS: {
    PROFILE: "/api/users/profile",
    CHANGE_PASSWORD: "/api/users/change-password",
  },
  STATISTICS: "/api/statistics",
  UPLOAD: "/api/upload",
};

// ISSUE STATUSES
export const ISSUE_STATUSES = {
  TO_DO: "to-do",
  PROGRESS: "progress",
  DONE: "done",
  REJECTED: "rejected",
} as const;

// ISSUE CATEGORIES
export const ISSUE_CATEGORIES = {
  ROADS: "roads",
  ENERGY_SUPPLY: "energy-supply",
  WATER_SUPPLY: "water-supply",
  NETWORK: "network",
  PUBLIC_TRANSPORT: "public-transport",
  ECOLOGY: "ecology",
  SAFETY: "safety",
  CSC: "csc",
} as const;

// ISSUE IMPORTANCE
export const ISSUE_IMPORTANCE = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

// ISSUE CATEGORY LABELS
export const CATEGORY_LABELS = {
  [ISSUE_CATEGORIES.ROADS]: "Roads",
  [ISSUE_CATEGORIES.ENERGY_SUPPLY]: "Energy Supply",
  [ISSUE_CATEGORIES.WATER_SUPPLY]: "Water Supply",
  [ISSUE_CATEGORIES.NETWORK]: "Network",
  [ISSUE_CATEGORIES.PUBLIC_TRANSPORT]: "Public Transport",
  [ISSUE_CATEGORIES.ECOLOGY]: "Ecology",
  [ISSUE_CATEGORIES.SAFETY]: "Safety",
  [ISSUE_CATEGORIES.CSC]: "Citizens Service Center",
};

// ISSUE STATUS LABELS
export const STATUS_LABELS = {
  [ISSUE_STATUSES.TO_DO]: "To Do",
  [ISSUE_STATUSES.PROGRESS]: "In Progress",
  [ISSUE_STATUSES.DONE]: "Done",
  [ISSUE_STATUSES.REJECTED]: "Rejected",
};

// ISSUE IMPORTANCE LABELS
export const IMPORTANCE_LABELS = {
  [ISSUE_IMPORTANCE.LOW]: "Low",
  [ISSUE_IMPORTANCE.MEDIUM]: "Medium",
  [ISSUE_IMPORTANCE.HIGH]: "High",
};

// CATEGORY COLORS
export const CATEGORY_COLORS: Record<string, string> = {
  [ISSUE_CATEGORIES.ROADS]: "#FF9800", // Orange
  [ISSUE_CATEGORIES.ENERGY_SUPPLY]: "#FFC107", // Amber
  [ISSUE_CATEGORIES.WATER_SUPPLY]: "#03A9F4", // Light Blue
  [ISSUE_CATEGORIES.NETWORK]: "#9C27B0", // Purple
  [ISSUE_CATEGORIES.PUBLIC_TRANSPORT]: "#1976D2", // Blue
  [ISSUE_CATEGORIES.ECOLOGY]: "#4CAF50", // Green
  [ISSUE_CATEGORIES.SAFETY]: "#F44336", // Red
  [ISSUE_CATEGORIES.CSC]: "#607D8B", // Blue Grey
};

// STATUS COLORS
export const STATUS_COLORS = {
  [ISSUE_STATUSES.TO_DO]: "#FFC107", // Amber
  [ISSUE_STATUSES.PROGRESS]: "#1976D2", // Blue
  [ISSUE_STATUSES.DONE]: "#4CAF50", // Green
  [ISSUE_STATUSES.REJECTED]: "#F44336", // Red
};

// IMPORTANCE COLORS
export const IMPORTANCE_COLORS = {
  [ISSUE_IMPORTANCE.LOW]: "#4CAF50", // Green
  [ISSUE_IMPORTANCE.MEDIUM]: "#FF9800", // Orange
  [ISSUE_IMPORTANCE.HIGH]: "#F44336", // Red
};

// VALIDATION
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  ISSUE_TITLE_MIN_LENGTH: 5,
  ISSUE_TITLE_MAX_LENGTH: 100,
  ISSUE_DESCRIPTION_MIN_LENGTH: 10,
  ISSUE_DESCRIPTION_MAX_LENGTH: 1000,
  COMMENT_MIN_LENGTH: 1,
  COMMENT_MAX_LENGTH: 500,
};

// MEDIA QUERIES
export const MEDIA_QUERIES = {
  MOBILE: "(max-width: 639px)",
  TABLET: "(min-width: 640px) and (max-width: 1023px)",
  DESKTOP: "(min-width: 1024px)",
};

// BREAKPOINTS
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
};
