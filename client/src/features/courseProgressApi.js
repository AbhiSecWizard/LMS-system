import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Fix: Yahan VITE_API_URL ke baad forward slash (/) lagaya gaya hai
const COURSE_PROGRESS_API = `${import.meta.env.VITE_API_URL}/progress`;

export const courseProgressApi = createApi({
  reducerPath: "courseProgressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PROGRESS_API,
    credentials: "include",
  }),
  tagTypes: ["CourseProgress"], 
  endpoints: (builder) => ({
    getCourseProgress: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
      providesTags: (result, error, courseId) => [{ type: "CourseProgress", id: courseId }],
    }),
    updateLectureProgress: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `/${courseId}/lectures/${lectureId}`, 
        method: "POST", 
      }),
      invalidatesTags: (result, error, { courseId }) => [{ type: "CourseProgress", id: courseId }],
    }),
    completedCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}/complete`, 
        method: "POST",
      }),
      invalidatesTags: (result, error, courseId) => [{ type: "CourseProgress", id: courseId }],
    }),
    inCompleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}/incomplete`, 
        method: "POST",
      }),
      invalidatesTags: (result, error, courseId) => [{ type: "CourseProgress", id: courseId }],
    }),
  }),
});

export const {
  useGetCourseProgressQuery,
  useUpdateLectureProgressMutation,
  useCompletedCourseMutation,
  useInCompleteCourseMutation, 
} = courseProgressApi;

export default courseProgressApi;