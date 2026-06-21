import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const baseUrl = "http://localhost:3000/api/v1/user";

const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),

  tagTypes: ["User"],

  endpoints: (builder) => ({
    // Register User
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),

    // Login User
    loginUser: builder.mutation({
      query: (userData) => ({
        url: "/login",
        method: "POST",
        body: userData,
      }),

      invalidatesTags: ["User"],

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          // Optional: instantly update redux
          if (data?.user) {
            dispatch(userLoggedIn({ user: data.user }));
          }
        } catch (error) {
          console.error("Login error:", error);
        }
      },
    }),

    // Load Current User Profile
    loadUser: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),

      providesTags: ["User"],

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.user) {
            dispatch(userLoggedIn({ user: data.user }));
          }
        } catch (error) {
          console.error("Load user error:", error);
        }
      },
    }),

    // Update Profile
    updateUser: builder.mutation({
      query: (formData) => ({
        url: "/profile/update",
        method: "PUT",
        body: formData,
      }),

      invalidatesTags: ["User"],
    }),

    // Logout User
    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "GET",
      }),

      invalidatesTags: ["User"],

      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;

          dispatch(userLoggedOut());
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation,
  useLogoutUserMutation,
} = authApi;

export default authApi;