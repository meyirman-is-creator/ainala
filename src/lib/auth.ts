import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { User } from "@/types/user";

// This is used to generate callbacks for NextAuth
export const buildAuthOptions = (): NextAuthOptions => {
  return {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          try {
            // In a real app, this would make a request to an authentication API
            // For this demo, we're using mock data

            // Check if email contains 'admin' to simulate an admin user
            const isAdmin = credentials.email.includes("admin");

            const user = {
              id: isAdmin ? "admin1" : "user1",
              name: isAdmin ? "Admin User" : "Antonio Banderas",
              email: credentials.email,
              role: isAdmin ? "admin" : "user",
              isVerified: true,
              createdAt: new Date().toISOString(),
            };

            return user;
          } catch (error) {
            console.error("Auth error:", error);
            return null;
          }
        },
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
      }),
      AppleProvider({
        clientId: process.env.APPLE_ID || "mock-client-id",
        clientSecret: process.env.APPLE_SECRET || "mock-client-secret",
      }),
    ],
    pages: {
      signIn: "/sign-in",
      signOut: "/",
      error: "/sign-in",
      verifyRequest: "/verify-email",
    },
    callbacks: {
      async jwt({ token, user, account }) {
        if (user) {
          token.id = user.id;
          token.role = (user as User).role || "user";
          token.isVerified = (user as User).isVerified || false;
        }
        return token;
      },
      async session({ session, token }) {
        if (token && session.user) {
          session.user.id = token.id as string;
          session.user.role = token.role as string;
          session.user.isVerified = token.isVerified as boolean;
        }
        return session;
      },
    },
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
  };
};

// Helper to check if user has admin role
export const isAdmin = (user: User | undefined | null): boolean => {
  return user?.role === "admin";
};

// Helper to check if user is authenticated
export const isAuthenticated = (user: User | undefined | null): boolean => {
  return !!user;
};

// Helper to check if JWT is valid
export const isValidJWT = (token: JWT | null): boolean => {
  if (!token) return false;

  // Check token expiry
  const expiryTime = token.exp || 0;
  const currentTime = Math.floor(Date.now() / 1000);

  return expiryTime > currentTime;
};

// Helper to decode a verification token
export const decodeVerificationToken = (
  token: string
): { email: string; expires: number } | null => {
  try {
    // In a real app, this would use JWT verification
    // For this demo, we'll just decode a simple format
    const [email, expires] = token.split("|");

    if (!email || !expires) {
      return null;
    }

    return {
      email,
      expires: parseInt(expires, 10),
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Helper to generate a verification token
export const generateVerificationToken = (
  email: string,
  expiresInMinutes = 30
): string => {
  // In a real app, this would use JWT signing
  // For this demo, we'll just create a simple format
  const expires = Math.floor(Date.now() / 1000) + expiresInMinutes * 60;
  return `${email}|${expires}`;
};

// Helper to hash passwords (mock for demo)
export const hashPassword = async (password: string): Promise<string> => {
  // In a real app, use bcrypt or similar
  return `hashed-${password}`;
};

// Helper to compare passwords (mock for demo)
export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  // In a real app, use bcrypt or similar
  return hashedPassword === `hashed-${password}`;
};
