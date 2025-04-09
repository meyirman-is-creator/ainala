import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store';
import { loginSuccess, logout } from '@/store/slices/auth-slice';
import { showToast } from '@/store/slices/ui-slice';
import { User } from '@/types/user';
import { registerUser, verifyEmail, resetPassword } from '@/lib/api-helpers';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logoutUser: () => Promise<void>;
  verifyUserEmail: (email: string, code: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetUserPassword: (token: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  
  // Extract user from session
  const user = session?.user as User | null;
  const isAdmin = user?.role === 'admin' || false;
  const isAuthenticated = !!session;
  const isLoading = status === 'loading';
  
  // Login with credentials
  const login = async (email: string, password: string, remember: boolean = false): Promise<boolean> => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/dashboard',
      });
      
      if (result?.error) {
        setError(result.error);
        dispatch(showToast({ 
          message: 'Invalid email or password', 
          type: 'error' 
        }));
        return false;
      }
      
      if (result?.ok && user) {
        dispatch(loginSuccess(user));
        dispatch(showToast({ 
          message: 'Successfully signed in!', 
          type: 'success' 
        }));
        return true;
      }
      
      return false;
    } catch (err) {
      setError('An error occurred during login');
      dispatch(showToast({ 
        message: 'An error occurred during login', 
        type: 'error' 
      }));
      return false;
    }
  };
  
  // Register new user
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // API call to register user
      const response = await registerUser({ name, email, password });
      
      if (response.success) {
        dispatch(showToast({ 
          message: 'Registration successful! Please verify your email.', 
          type: 'success' 
        }));
        return true;
      } else {
        setError(response.message || 'Registration failed');
        dispatch(showToast({ 
          message: response.message || 'Registration failed', 
          type: 'error' 
        }));
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      dispatch(showToast({ 
        message: errorMessage, 
        type: 'error' 
      }));
      return false;
    }
  };
  
  // Logout user
  const logoutUser = async (): Promise<void> => {
    await signOut({ redirect: false });
    dispatch(logout());
    router.push('/');
    dispatch(showToast({ 
      message: 'Successfully signed out', 
      type: 'success' 
    }));
  };
  
  // Verify email
  const verifyUserEmail = async (email: string, code: string): Promise<boolean> => {
    try {
      const response = await verifyEmail(email, code);
      
      if (response.success) {
        dispatch(showToast({ 
          message: 'Email verified successfully!', 
          type: 'success' 
        }));
        return true;
      } else {
        setError(response.message || 'Email verification failed');
        dispatch(showToast({ 
          message: response.message || 'Email verification failed', 
          type: 'error' 
        }));
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Email verification failed';
      setError(errorMessage);
      dispatch(showToast({ 
        message: errorMessage, 
        type: 'error' 
      }));
      return false;
    }
  };
  
  // Forgot password
  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      // In a real app, this would send an email with password reset instructions
      // For this demo, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch(showToast({ 
        message: 'Password reset email sent!', 
        type: 'success' 
      }));
      return true;
    } catch (err) {
      setError('Failed to send password reset email');
      dispatch(showToast({ 
        message: 'Failed to send password reset email', 
        type: 'error' 
      }));
      return false;
    }
  };
  
  // Reset password
  const resetUserPassword = async (token: string, password: string): Promise<boolean> => {
    try {
      const response = await resetPassword(token, password);
      
      if (response.success) {
        dispatch(showToast({ 
          message: 'Password reset successfully!', 
          type: 'success' 
        }));
        return true;
      } else {
        setError(response.message || 'Password reset failed');
        dispatch(showToast({ 
          message: response.message || 'Password reset failed', 
          type: 'error' 
        }));
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
      setError(errorMessage);
      dispatch(showToast({ 
        message: errorMessage, 
        type: 'error' 
      }));
      return false;
    }
  };
  
  // Login with Google
  const loginWithGoogle = async (): Promise<void> => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };
  
  // Login with Apple
  const loginWithApple = async (): Promise<void> => {
    await signIn('apple', { callbackUrl: '/dashboard' });
  };
  
  return {
    user,
    isLoading,
    isAdmin,
    isAuthenticated,
    error,
    login,
    register,
    logoutUser,
    verifyUserEmail,
    forgotPassword,
    resetUserPassword,
    loginWithGoogle,
    loginWithApple,
  };
};