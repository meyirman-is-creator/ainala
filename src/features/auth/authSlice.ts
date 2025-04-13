import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   isAuthenticated: false,
//   isLoading: false,
// };
const initialState: AuthState = {
    user: {
      id: "test-user-id",
      name: "Тестовый Пользователь",
      email: "test@example.com",
      role: "admin", // Можно переключать между "user" и "admin" для тестирования разных ролей
      avatar: "",
    },
    token: "mock-token",
    isAuthenticated: true, // Автоматически считаем, что пользователь авторизован
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
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser } =
  authSlice.actions;

export default authSlice.reducer;
