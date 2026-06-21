import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const baseUrl = `${import.meta.env.VITE_USER_BASE_URL}`;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),

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
          if (data?.user) {
            dispatch(userLoggedIn({ user: data.user }));
          }
        } catch (error) {
          console.error("Login error:", error);
        }
      },
    }),

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

    updateUser: builder.mutation({
      query: (formData) => ({
        url: "/profile/update",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

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