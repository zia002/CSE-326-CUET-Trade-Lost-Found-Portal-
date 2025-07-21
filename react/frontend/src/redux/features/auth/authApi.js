import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseURL } from "../../../utils/baseURL";
import { signOut } from "./authSlice";

const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseURL()}/api/auth`, // ✅ Function is now called
    credentials: "include",
  }),
  tagTypes: ["User", "Users"],
  endpoints: (builder) => ({
    signUpUser: builder.mutation({
      query: (newUser) => ({
        url: "/signup",
        method: "POST",
        body: newUser,
      }),
    }),
    signInUser: builder.mutation({
      query: (credentials) => ({
        url: "/signin",
        method: "POST",
        body: credentials,
      }),
    }),
    signOutUser: builder.mutation({
      query: () => ({
        url: "/signout",
        method: "POST",
      }),
    }),
    getUser: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      refetchOnMount: true,
      invaliddatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    updateUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/users/${userId}`,
        method: "PATCH",
        body: { PUT },
      }),
      refetchOnMount: true,
      invalidatesTags: ["Users"],
    }),
    editProfile: builder.mutation({
      query: (profileData) => ({
        url: "/edit-profile",
        method: "PATCH",
        body: profileData,
      }),
    }),
    getSignedInUser: builder.query({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSignUpUserMutation,
  useSignInUserMutation,
  useSignOutUserMutation,
  useGetUserQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useEditProfileMutation,
  useGetSignedInUserQuery,
} = authApi;
export default authApi;
