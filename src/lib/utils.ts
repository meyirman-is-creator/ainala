import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import {
  ISSUE_CATEGORIES,
  ISSUE_STATUSES,
  CATEGORY_LABELS,
  STATUS_LABELS,
} from "./constants";
import { IssueCategory, IssueStatus } from "@/types/issue";

// Tailwind CSS utility for merging classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a date string using date-fns
export function formatDate(
  date: string | Date,
  formatString: string = "PP"
): string {
  return format(new Date(date), formatString);
}

// Format a date as relative time (e.g., "2 days ago")
export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Generate a random ID
export function generateId(prefix: string = ""): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Check if a string is a valid email
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Truncate text to a certain length
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
}

// Get label for issue category
export function getCategoryLabel(category: IssueCategory): string {
  return CATEGORY_LABELS[category] || category;
}

// Get label for issue status
export function getStatusLabel(status: IssueStatus): string {
  return STATUS_LABELS[status] || status;
}

// Convert snake_case to camelCase
export function snakeToCamel(str: string): string {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
}

// Convert camelCase to snake_case
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

// Format a numerical value with commas for thousands
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Format a percentage (e.g., 45.5% -> "46%")
export function formatPercentage(
  percentage: number,
  decimalPlaces: number = 0
): string {
  return `${percentage.toFixed(decimalPlaces)}%`;
}

// Generate an array of numbers for pagination
export function generatePagination(
  currentPage: number,
  totalPages: number
): number[] {
  // If 5 or fewer pages, show all
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If current page is among the first 3
  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5];
  }

  // If current page is among the last 3
  if (currentPage >= totalPages - 2) {
    return [
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // Otherwise, show current page with 2 pages on each side
  return [
    currentPage - 2,
    currentPage - 1,
    currentPage,
    currentPage + 1,
    currentPage + 2,
  ];
}

// Get a random item from an array
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function (...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return function (...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Deep clone an object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Convert a File to a data URL
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Get file extension
export function getFileExtension(filename: string): string {
  return filename
    .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
    .toLowerCase();
}

// Check if a file is an image
export function isImageFile(file: File): boolean {
  const imageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];
  return imageTypes.includes(file.type);
}

// Format coordinates to a more readable format
export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

// Extract URLs from text
export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

// Validate a password strength
export function isStrongPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

// Get password strength score (0-4)
export function getPasswordStrength(password: string): number {
  let score = 0;

  // Length check
  if (password.length >= 8) score++;

  // Contains lowercase
  if (/[a-z]/.test(password)) score++;

  // Contains uppercase
  if (/[A-Z]/.test(password)) score++;

  // Contains number
  if (/\d/.test(password)) score++;

  // Contains special character
  if (/[@$!%*?&]/.test(password)) score++;

  return score;
}

// Get all available issue categories
export function getIssueCategories(): IssueCategory[] {
  return Object.values(ISSUE_CATEGORIES);
}

// Get all available issue statuses
export function getIssueStatuses(): IssueStatus[] {
  return Object.values(ISSUE_STATUSES);
}
