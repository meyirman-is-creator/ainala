import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isSidebarExpanded: boolean;
  activeTab: string;
  toast: {
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  };
  isFilterModalOpen: boolean;
}

const initialState: UIState = {
  isSidebarExpanded: false,
  activeTab: "to-do",
  toast: {
    show: false,
    message: "",
    type: "info",
  },
  isFilterModalOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarExpanded = !state.isSidebarExpanded;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    showToast: (
      state,
      action: PayloadAction<{
        message: string;
        type: "success" | "error" | "info";
      }>
    ) => {
      state.toast = {
        show: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    hideToast: (state) => {
      state.toast.show = false;
    },
    toggleFilterModal: (state) => {
      state.isFilterModalOpen = !state.isFilterModalOpen;
    },
  },
});

export const {
  toggleSidebar,
  setActiveTab,
  showToast,
  hideToast,
  toggleFilterModal,
} = uiSlice.actions;

export default uiSlice.reducer;
