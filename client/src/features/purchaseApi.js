import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

const PURCHASE_API = `${import.meta.env.VITE_API_URL}/payment`;

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getCourseWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/detail-with-status`, 
        method: "GET",
      }),
    }),
    getPurchaseCourses: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetCourseWithStatusQuery,
  useGetPurchaseCoursesQuery,
} = purchaseApi;