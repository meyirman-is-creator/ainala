import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// For development purposes, we're setting a default user
// In a real application, this would start as null and require login
const initialState: AuthState = {
  user: {
    id: "test-user-id",
    name: "Тестовый Пользователь",
    email: "test@example.com",
    role: "user", // Can be "user", "admin", or "executor"
    avatar: "",
  },
  token: "mock-token",
  isAuthenticated: true, // Automatically consider the user authenticated
  isLoading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure: (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    // Add a function to switch roles (for testing)
    switchRole: (
      state,
      action: PayloadAction<"user" | "admin" | "executor">
    ) => {
      if (state.user) {
        state.user.role = action.payload;
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  switchRole,
} = authSlice.actions;

export default authSlice.reducer;
