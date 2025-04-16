import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Issue, Comment, User } from "@/types";

// Define a proper type for the state to avoid using 'any'
interface RootState {
  auth: {
    token: string | null;
  };
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      // Use the proper type instead of 'any'
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Issues", "Comments", "User"],
  endpoints: (builder) => ({
    getIssues: builder.query<
      Issue[],
      { status?: string; category?: string; search?: string; page?: number }
    >({
      query: (params) => ({
        url: "issues",
        params,
      }),
      providesTags: ["Issues"],
    }),

    getUserIssues: builder.query<Issue[], void>({
      query: () => "account/issues",
      providesTags: ["Issues"],
    }),

    getIssueById: builder.query<Issue, string>({
      query: (id) => `issues/${id}`,
      providesTags: ["Issues"],
    }),

    createIssue: builder.mutation<Issue, Partial<Issue>>({
      query: (issue) => ({
        url: "account/issues",
        method: "POST",
        body: issue,
      }),
      invalidatesTags: ["Issues"],
    }),

    updateIssue: builder.mutation<Issue, { id: string; data: Partial<Issue> }>({
      query: ({ id, data }) => ({
        url: `account/issues/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Issues"],
    }),

    likeIssue: builder.mutation<void, string>({
      query: (id) => ({
        url: `issues/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: ["Issues"],
    }),

    getComments: builder.query<Comment[], string>({
      query: (issueId) => `issues/${issueId}/comments`,
      providesTags: ["Comments"],
    }),

    addComment: builder.mutation<Comment, { issueId: string; content: string }>(
      {
        query: ({ issueId, content }) => ({
          url: `issues/${issueId}/comments`,
          method: "POST",
          body: { content },
        }),
        invalidatesTags: ["Comments"],
      }
    ),

    updateUserProfile: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: "account/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    adminUpdateIssue: builder.mutation<
      Issue,
      { id: string; data: Partial<Issue> }
    >({
      query: ({ id, data }) => ({
        url: `admin/issues/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Issues"],
    }),
  }),
});

export const {
  useGetIssuesQuery,
  useGetUserIssuesQuery,
  useGetIssueByIdQuery,
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useLikeIssueMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useUpdateUserProfileMutation,
  useAdminUpdateIssueMutation,
} = api;