import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import { createApi } from "@reduxjs/toolkit/query/react"
import { userLoggedIn, userLoggedOut } from "../authSlice";

// Removed the trailing slash here
const baseUrls = 'http://localhost:3000/api/v1/user'

const authApi = createApi({ 
  reducerPath: "authApi", 
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrls, 
    credentials: "include", 
  }),
  // Tag types tell RTK Query when to clear cached data
  tagTypes: ["User"], 
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: '/register',
        method: 'POST',
        body: inputData
      })
    }),
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: '/login',
        method: 'POST',
        body: inputData
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }))
        } catch (error) {
          console.log(error)
        }
      }
    }),
    loadUser: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET"
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }))
        } catch (error) {
          console.log(error)
        }
      },
      providesTags: ["User"] // Cache tied to this tag
    }),
    updateUser: builder.mutation({
      query: (formData) => ({
        url: "/profile/update", // Fixed potential double slash issue
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"] // Automatically forces 'loadUser' to refetch fresh data
    }),
    logoutUser: builder.mutation({
      query:()=>({
        url:"logout",
        method:"GET",
      }),
       async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoggedOut({ user: null }))
        } catch (error) {
          console.log(error)
        }
      }
    })
  })
})

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLoadUserQuery,
  useUpdateUserMutation,useLogoutUserMutation
} = authApi

export default authApi;