import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setIssues,
  setUserIssues,
  setCurrentIssue,
  addIssue,
  updateIssue,
  deleteIssue,
  setIsLoading,
  setError,
  addComment,
  toggleLike,
} from "@/store/slices/issues-slice";
import { showToast } from "@/store/slices/ui-slice";
import { Issue, IssueStatus, IssueCategory } from "@/types/issue";
import {
  fetchIssues,
  fetchIssueById,
  createIssue,
  updateIssueById,
  deleteIssueById,
  addCommentToIssue,
  toggleLikeOnIssue,
} from "@/lib/api-helpers";

interface UseIssuesOptions {
  initialIssues?: Issue[];
  userId?: string;
  status?: IssueStatus | null;
  category?: IssueCategory | null;
  search?: string;
  page?: number;
  limit?: number;
}

interface UseIssuesReturn {
  issues: Issue[];
  userIssues: Issue[];
  currentIssue: Issue | null;
  isLoading: boolean;
  error: string | null;
  totalIssues: number;
  totalPages: number;
  currentPage: number;
  fetchAllIssues: (options?: Partial<UseIssuesOptions>) => Promise<void>;
  fetchUserIssues: (userId: string) => Promise<void>;
  fetchIssueDetails: (id: string) => Promise<void>;
  createNewIssue: (data: Partial<Issue>) => Promise<Issue | null>;
  updateIssueDetails: (
    id: string,
    data: Partial<Issue>
  ) => Promise<Issue | null>;
  removeIssue: (id: string) => Promise<boolean>;
  addNewComment: (issueId: string, comment: string) => Promise<boolean>;
  toggleIssueLike: (issueId: string) => Promise<boolean>;
  clearCurrentIssue: () => void;
}

export const useIssues = (options?: UseIssuesOptions): UseIssuesReturn => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  const issues = useAppSelector((state) => state.issues.issues);
  const userIssues = useAppSelector((state) => state.issues.userIssues);
  const currentIssue = useAppSelector((state) => state.issues.currentIssue);
  const isLoading = useAppSelector((state) => state.issues.isLoading);
  const error = useAppSelector((state) => state.issues.error);

  const [totalIssues, setTotalIssues] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(options?.page || 1);

  // Initialize with initial issues if provided
  useEffect(() => {
    if (options?.initialIssues) {
      dispatch(setIssues(options.initialIssues));
    }
  }, [dispatch, options?.initialIssues]);

  // Fetch all issues
  const fetchAllIssues = async (
    fetchOptions: Partial<UseIssuesOptions> = {}
  ): Promise<void> => {
    dispatch(setIsLoading(true));

    try {
      const mergedOptions = {
        status: options?.status ?? null,
        category: options?.category ?? null,
        search: options?.search ?? "",
        page: options?.page ?? 1,
        limit: options?.limit ?? 10,
        ...fetchOptions,
      };

      const response = await fetchIssues(mergedOptions);

      if (response.success && response.data) {
        dispatch(setIssues(response.data.issues));
        setTotalIssues(response.data.pagination.totalIssues);
        setTotalPages(response.data.pagination.totalPages);
        setCurrentPage(response.data.pagination.currentPage);
      } else {
        throw new Error(response.message || "Failed to fetch issues");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch issues";
      dispatch(setError(errorMessage));
      dispatch(
        showToast({
          message: errorMessage,
          type: "error",
        })
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  // Fetch user's issues
  const fetchUserIssues = async (userId: string): Promise<void> => {
    dispatch(setIsLoading(true));

    try {
      const response = await fetchIssues({ userId });

      if (response.success && response.data) {
        dispatch(setUserIssues(response.data.issues));
      } else {
        throw new Error(response.message || "Failed to fetch user issues");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch user issues";
      dispatch(setError(errorMessage));
      dispatch(
        showToast({
          message: errorMessage,
          type: "error",
        })
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  // Fetch issue details
  const fetchIssueDetails = async (id: string): Promise<void> => {
    dispatch(setIsLoading(true));

    try {
      const response = await fetchIssueById(id);

      if (response.success && response.data) {
        dispatch(setCurrentIssue(response.data));
      } else {
        throw new Error(response.message || "Failed to fetch issue details");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch issue details";
      dispatch(setError(errorMessage));
      dispatch(
        showToast({
          message: errorMessage,
          type: "error",
        })
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  // Create new issue
  const createNewIssue = async (
    data: Partial<Issue>
  ): Promise<Issue | null> => {
    dispatch(setIsLoading(true));

    try {
      const response = await createIssue(data);

      if (response.success && response.data) {
        dispatch(addIssue(response.data));
        dispatch(
          showToast({
            message: "Issue created successfully!",
            type: "success",
          })
        );
        return response.data;
      } else {
        throw new Error(response.message || "Failed to create issue");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create issue";
      dispatch(setError(errorMessage));
      dispatch(
        showToast({
          message: errorMessage,
          type: "error",
        })
      );
      return null;
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  // Update issue
  const updateIssueDetails = async (
    id: string,
    data: Partial<Issue>
  ): Promise<Issue | null> => {
    dispatch(setIsLoading(true));

    try {
      const response = await updateIssueById(id, data);

      if (response.success && response.data) {
        dispatch(updateIssue(response.data));
        dispatch(
          showToast({
            message: "Issue updated successfully!",
            type: "success",
          })
        );
        return response.data;
      } else {
        throw new Error(response.message || "Failed to update issue");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update issue";
      dispatch(setError(errorMessage));
      dispatch(
        showToast({
          message: errorMessage,
          type: "error",
        })
      );
      return null;
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  // Delete issue
  const removeIssue = async (id: string): Promise<boolean> => {
    dispatch(setIsLoading(true));

    try {
      const response = await deleteIssueById(id);

      if (response.success) {
        dispatch(deleteIssue(id));
        dispatch(
          showToast({
            message: "Issue deleted successfully!",
            type: "success",
          })
        );
        return true;
      } else {
        throw new Error(response.message || "Failed to delete issue");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete issue";
      dispatch(setError(errorMessage));
      dispatch(
        showToast({
          message: errorMessage,
          type: "error",
        })
      );
      return false;
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  // Add comment
  const addNewComment = async (
    issueId: string,
    comment: string
  ): Promise<boolean> => {
    if (!session) {
      dispatch(
        showToast({
          message: "You must be signed in to comment",
          type: "error",
        })
      );
      return false;
    }

    try {
      const response = await addCommentToIssue(issueId, comment);

      if (response.success && response.data) {
        dispatch(
          addComment({
            issueId,
            comment: response.data,
          })
        );
        dispatch(
          showToast({
            message: "Comment added successfully!",
            type: "success",
          })
        );
        return true;
      } else {
        throw new Error(response.message || "Failed to add comment");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add comment";
      dispatch(setError(errorMessage));
      dispatch(
        showToast({
          message: errorMessage,
          type: "error",
        })
      );
      return false;
    }
  };

  // Toggle like
  const toggleIssueLike = async (issueId: string): Promise<boolean> => {
    if (!session) {
      dispatch(
        showToast({
          message: "You must be signed in to like issues",
          type: "error",
        })
      );
      return false;
    }

    try {
      const response = await toggleLikeOnIssue(issueId);

      if (response.success) {
        dispatch(toggleLike(issueId));
        return true;
      } else {
        throw new Error(response.message || "Failed to toggle like");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to toggle like";
      dispatch(setError(errorMessage));
      dispatch(
        showToast({
          message: errorMessage,
          type: "error",
        })
      );
      return false;
    }
  };

  // Clear current issue
  const clearCurrentIssue = (): void => {
    dispatch(setCurrentIssue(null));
  };

  return {
    issues,
    userIssues,
    currentIssue,
    isLoading,
    error,
    totalIssues,
    totalPages,
    currentPage,
    fetchAllIssues,
    fetchUserIssues,
    fetchIssueDetails,
    createNewIssue,
    updateIssueDetails,
    removeIssue,
    addNewComment,
    toggleIssueLike,
    clearCurrentIssue,
  };
};
