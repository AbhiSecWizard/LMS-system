// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const COURSE_PROGRESS_API = "http://localhost:3000/api/v1/progress";

// export const courseProgressApi = createApi({
//   reducerPath: "courseProgressApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: COURSE_PROGRESS_API,
//     credentials: "include",
//   }),
//   // 🌟 Tags define kiye hain taaki data automated sync/refresh ho sake
//   tagTypes: ["CourseProgress"], 
  
//   endpoints: (builder) => ({
//     getCourseProgress: builder.query({
//       query: (courseId) => ({
//         url: `/${courseId}`,
//         method: "GET",
//       }),
//       providesTags: (result, error, courseId) => [{ type: "CourseProgress", id: courseId }],
//     }),

//     updateLectureProgress: builder.mutation({
//       query: ({ courseId, lectureId }) => ({
//         url: `/${courseId}/lectures/${lectureId}`,
//         method: "POST", // Agar backend standard REST follow karta hai toh yahan PATCH/PUT bhi ho sakta hai
//       }),
//       // 🌟 Is mutation ke chalte hi getCourseProgress automatic dubara call ho jayega
//       invalidatesTags: (result, error, { courseId }) => [{ type: "CourseProgress", id: courseId }],
//     }),

//     completedCourse: builder.mutation({
//       query: (courseId) => ({
//         url: `/${courseId}/complete`,
//         method: "POST",
//       }),
//       invalidatesTags: (result, error, courseId) => [{ type: "CourseProgress", id: courseId }],
//     }),

//     inCompleteCourse: builder.mutation({
//       query: (courseId) => ({
//         url: `/${courseId}/incomplete`,
//         method: "POST",
//       }),
//       invalidatesTags: (result, error, courseId) => [{ type: "CourseProgress", id: courseId }],
//     }),
//   }),
// });

// // 🌟 Sahi hooks export (useInCompleteCourseMutation ko add kiya gaya hai)
// export const {
//   useGetCourseProgressQuery,
//   useUpdateLectureProgressMutation,
//   useCompletedCourseMutation,
//   useInCompleteCourseMutation, // Added missing hook
// } = courseProgressApi;

// export default courseProgressApi;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PROGRESS_API = "http://localhost:3000/api/v1/progress";

export const courseProgressApi = createApi({
  reducerPath: "courseProgressApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PROGRESS_API,
    credentials: "include", // Cookies handling ke liye bilkul sahi hai
  }),
  tagTypes: ["CourseProgress"], 
  
  endpoints: (builder) => ({
    // 1. Get Course Progress
    getCourseProgress: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
      // Dynamic ID mapping taaki sirf usi specific course ka cache reload ho
      providesTags: (result, error, courseId) => [{ type: "CourseProgress", id: courseId }],
    }),

    // 2. Update Lecture Progress
    updateLectureProgress: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        // 🌟 CHECK: Apne Express routes check karein ki wahan '/:courseId/lecture/:lectureId' hai ya '/:courseId/lectures/:lectureId'
        url: `/${courseId}/lectures/${lectureId}`, 
        method: "POST", 
      }),
      // Jaise hi yeh hook chalega, getCourseProgress automatic refetch ho jayega!
      invalidatesTags: (result, error, { courseId }) => [{ type: "CourseProgress", id: courseId }],
    }),

    // 3. Mark Course As Completed
    completedCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}/complete`, // 🌟 Sahi karein agar backend pe route '/:courseId/complete' hai
        method: "POST",
      }),
      invalidatesTags: (result, error, courseId) => [{ type: "CourseProgress", id: courseId }],
    }),

    // 4. Mark Course As Incomplete
    inCompleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}/incomplete`, // 🌟 Sahi karein agar backend pe route '/:courseId/incomplete' hai
        method: "POST",
      }),
      invalidatesTags: (result, error, courseId) => [{ type: "CourseProgress", id: courseId }],
    }),
  }),
});

// Hooks export
export const {
  useGetCourseProgressQuery,
  useUpdateLectureProgressMutation,
  useCompletedCourseMutation,
  useInCompleteCourseMutation, 
} = courseProgressApi;

export default courseProgressApi;