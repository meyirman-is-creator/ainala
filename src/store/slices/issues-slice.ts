import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Issue, IssueStatus, IssueCategory } from "@/types/issue";

interface IssuesState {
  issues: Issue[];
  userIssues: Issue[];
  currentIssue: Issue | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: IssueStatus | null;
    category: IssueCategory | null;
    searchQuery: string;
  };
}

const initialState: IssuesState = {
  issues: [],
  userIssues: [],
  currentIssue: null,
  isLoading: false,
  error: null,
  filters: {
    status: null,
    category: null,
    searchQuery: "",
  },
};

export const issuesSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    setIssues: (state, action: PayloadAction<Issue[]>) => {
      state.issues = action.payload;
    },
    setUserIssues: (state, action: PayloadAction<Issue[]>) => {
      state.userIssues = action.payload;
    },
    setCurrentIssue: (state, action: PayloadAction<Issue | null>) => {
      state.currentIssue = action.payload;
    },
    addIssue: (state, action: PayloadAction<Issue>) => {
      state.issues.unshift(action.payload);
      state.userIssues.unshift(action.payload);
    },
    updateIssue: (state, action: PayloadAction<Issue>) => {
      const index = state.issues.findIndex(
        (issue) => issue.id === action.payload.id
      );
      if (index !== -1) {
        state.issues[index] = action.payload;
      }

      const userIndex = state.userIssues.findIndex(
        (issue) => issue.id === action.payload.id
      );
      if (userIndex !== -1) {
        state.userIssues[userIndex] = action.payload;
      }

      if (state.currentIssue?.id === action.payload.id) {
        state.currentIssue = action.payload;
      }
    },
    deleteIssue: (state, action: PayloadAction<string>) => {
      state.issues = state.issues.filter(
        (issue) => issue.id !== action.payload
      );
      state.userIssues = state.userIssues.filter(
        (issue) => issue.id !== action.payload
      );
      if (state.currentIssue?.id === action.payload) {
        state.currentIssue = null;
      }
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<IssueStatus | null>) => {
      state.filters.status = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<IssueCategory | null>) => {
      state.filters.category = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    addComment: (
      state,
      action: PayloadAction<{ issueId: string; comment: any }>
    ) => {
      const { issueId, comment } = action.payload;

      // Update in all issue lists
      const updateIssueComments = (issue: Issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            comments: [...(issue.comments || []), comment],
          };
        }
        return issue;
      };

      state.issues = state.issues.map(updateIssueComments);
      state.userIssues = state.userIssues.map(updateIssueComments);

      if (state.currentIssue?.id === issueId) {
        state.currentIssue = {
          ...state.currentIssue,
          comments: [...(state.currentIssue.comments || []), comment],
        };
      }
    },
    toggleLike: (state, action: PayloadAction<string>) => {
      const issueId = action.payload;

      // Update in all issue lists
      const updateIssueLikes = (issue: Issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            likes: issue.liked ? issue.likes - 1 : issue.likes + 1,
            liked: !issue.liked,
          };
        }
        return issue;
      };

      state.issues = state.issues.map(updateIssueLikes);
      state.userIssues = state.userIssues.map(updateIssueLikes);

      if (state.currentIssue?.id === issueId) {
        state.currentIssue = updateIssueLikes(state.currentIssue);
      }
    },
  },
});

export const {
  setIssues,
  setUserIssues,
  setCurrentIssue,
  addIssue,
  updateIssue,
  deleteIssue,
  setIsLoading,
  setError,
  setStatusFilter,
  setCategoryFilter,
  setSearchQuery,
  clearFilters,
  addComment,
  toggleLike,
} = issuesSlice.actions;

export default issuesSlice.reducer;
