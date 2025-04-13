import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Issue } from "@/types";

interface IssuesState {
  issues: Issue[];
  filteredIssues: Issue[];
  selectedIssue: Issue | null;
  filterStatus: string | null;
  filterCategory: string | null;
  searchQuery: string;
}

const initialState: IssuesState = {
  issues: [],
  filteredIssues: [],
  selectedIssue: null,
  filterStatus: null,
  filterCategory: null,
  searchQuery: "",
};

export const issuesSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    setIssues: (state, action: PayloadAction<Issue[]>) => {
      state.issues = action.payload;
      state.filteredIssues = action.payload;
    },
    setSelectedIssue: (state, action: PayloadAction<Issue | null>) => {
      state.selectedIssue = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<string | null>) => {
      state.filterStatus = action.payload;
      state.filteredIssues = state.issues.filter((issue) => {
        const statusMatch =
          !state.filterStatus || issue.status === state.filterStatus;
        const categoryMatch =
          !state.filterCategory || issue.category === state.filterCategory;
        const searchMatch =
          !state.searchQuery ||
          issue.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          issue.description
            .toLowerCase()
            .includes(state.searchQuery.toLowerCase());

        return statusMatch && categoryMatch && searchMatch;
      });
    },
    setFilterCategory: (state, action: PayloadAction<string | null>) => {
      state.filterCategory = action.payload;
      state.filteredIssues = state.issues.filter((issue) => {
        const statusMatch =
          !state.filterStatus || issue.status === state.filterStatus;
        const categoryMatch =
          !state.filterCategory || issue.category === state.filterCategory;
        const searchMatch =
          !state.searchQuery ||
          issue.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          issue.description
            .toLowerCase()
            .includes(state.searchQuery.toLowerCase());

        return statusMatch && categoryMatch && searchMatch;
      });
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredIssues = state.issues.filter((issue) => {
        const statusMatch =
          !state.filterStatus || issue.status === state.filterStatus;
        const categoryMatch =
          !state.filterCategory || issue.category === state.filterCategory;
        const searchMatch =
          !state.searchQuery ||
          issue.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          issue.description
            .toLowerCase()
            .includes(state.searchQuery.toLowerCase());

        return statusMatch && categoryMatch && searchMatch;
      });
    },
  },
});

export const {
  setIssues,
  setSelectedIssue,
  setFilterStatus,
  setFilterCategory,
  setSearchQuery,
} = issuesSlice.actions;

export default issuesSlice.reducer;
