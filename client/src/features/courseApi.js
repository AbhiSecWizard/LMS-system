// import { fetchBaseQuery } from "@reduxjs/toolkit/query";
// import { createApi } from "@reduxjs/toolkit/query/react";

// const COURSE_API = `${import.meta.env.VITE_API_URL}/course`;

// export const courseApi = createApi({
//   reducerPath: "courseApi",
//   tagTypes: ["Refetch_Creator_Course", "Refetch_Lecture", "CourseDetails"],
//   baseQuery: fetchBaseQuery({
//     baseUrl: COURSE_API,
//     credentials: "include",
//   }),
//   endpoints: (builder) => ({
//     createCourse: builder.mutation({
//       query: ({ courseTitle, category }) => ({
//         url: "/",
//         method: "POST",
//         body: { courseTitle, category },
//       }),
//       invalidatesTags: ["Refetch_Creator_Course"],
//     }),
//     getCreatorCourse: builder.query({
//       query: () => ({
//         url: "/",
//         method: "GET",
//       }),
//       providesTags: ["Refetch_Creator_Course"],
//     }),
//     getPublishedCourse: builder.query({
//       query: () => ({
//         url: "/published-course",
//         method: "GET",
//       }),
//     }),
//     editCourse: builder.mutation({
//       query: ({ courseId, formData }) => ({
//         url: `/${courseId}`,
//         method: "PUT",
//         body: formData,
//       }),
//       invalidatesTags: (result, error, { courseId }) => [
//         "Refetch_Creator_Course",
//         { type: "CourseDetails", id: courseId },
//       ],
//     }),
//     getCourseById: builder.query({
//       query: (courseId) => ({
//         url: `/${courseId}`,
//         method: "GET",
//       }),
//       providesTags: (result, error, courseId) => [
//         { type: "CourseDetails", id: courseId },
//       ],
//     }),
//     createLecture: builder.mutation({
//       query: ({ lectureTitle, courseId }) => ({
//         url: `/${courseId}/lecture`,
//         method: "POST",
//         body: { lectureTitle },
//       }),
//       invalidatesTags: (result, error, { courseId }) => [
//         "Refetch_Lecture",
//         { type: "CourseDetails", id: courseId },
//       ],
//     }),
//     getCourseLecture: builder.query({
//       query: (courseId) => ({
//         url: `/${courseId}/lecture`,
//         method: "GET",
//       }),
//       providesTags: ["Refetch_Lecture"],
//     }),
//     editLecture: builder.mutation({
//       query: ({
//         lectureTitle,
//         videoInfo,
//         isPreviewFree,
//         courseId,
//         lectureId,
//       }) => ({
//         url: `/${courseId}/lecture/${lectureId}`,
//         method: "PUT",
//         body: { lectureTitle, videoInfo, isPreviewFree },
//       }),
//     }),
//     removeLecture: builder.mutation({
//       query: (lectureId) => ({
//         url: `/lecture/${lectureId}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Refetch_Lecture", "CourseDetails"],
//     }),
//     getLectureById: builder.query({
//       query: (lectureId) => ({
//         url: `/lecture/${lectureId}`,
//         method: "GET",
//       }),
//     }),
//     publishCourse: builder.mutation({
//       query: ({ courseId, query }) => ({
//         url: `/${courseId}/publish?publish=${query}`,
//         method: "PATCH",
//       }),
//       invalidatesTags: (result, error, { courseId }) => [
//         { type: "CourseDetails", id: courseId },
//         "Refetch_Creator_Course",
//       ],
//     }),
//     getSearchCourse: builder.query({
//       query: ({ searchQuery = "", categories = [], sortByPrice = "" }) => {
//         let queryString = `/search?query=${encodeURIComponent(searchQuery)}`;
//         if (categories && categories.length > 0) {
//           const categoriesString = categories.map(encodeURIComponent).join(",");
//           queryString += `&categories=${categoriesString}`;
//         }
//         if (sortByPrice) {
//           queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
//         }
//         return {
//           url: queryString,
//           method: "GET",
//         };
//       },
//     }),
//   }),
// });

// export const {
//   usePublishCourseMutation,
//   useGetLectureByIdQuery,
//   useRemoveLectureMutation,
//   useEditLectureMutation,
//   useGetCourseLectureQuery,
//   useGetCourseByIdQuery,
//   useCreateCourseMutation,
//   useGetCreatorCourseQuery,
//   useEditCourseMutation,
//   useCreateLectureMutation,
//   useGetPublishedCourseQuery,
//   useGetSearchCourseQuery,
// } = courseApi;
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

const COURSE_API = `${import.meta.env.VITE_API_URL}/course`;

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Creator_Course", "Refetch_Lecture", "CourseDetails"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "/",
        method: "POST",
        body: { courseTitle, category },
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
    getCreatorCourse: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),
    getPublishedCourse: builder.query({
      query: () => ({
        url: "/published-course",
        method: "GET",
      }),
    }),
    editCourse: builder.mutation({
      query: ({ courseId, formData }) => ({
        url: `/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { courseId }) => [
        "Refetch_Creator_Course",
        { type: "CourseDetails", id: courseId },
      ],
    }),
    getCourseById: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
      // 🟢 FIXED: Safe argument resolution for cache keys
      providesTags: (result, error, arg) => {
        const id = typeof arg === "object" ? arg.courseId : arg;
        return [{ type: "CourseDetails", id }];
      },
    }),
    createLecture: builder.mutation({
      query: ({ lectureTitle, courseId }) => ({
        url: `/${courseId}/lecture`,
        method: "POST",
        body: { lectureTitle },
      }),
      invalidatesTags: (result, error, { courseId }) => [
        "Refetch_Lecture",
        { type: "CourseDetails", id: courseId },
      ],
    }),
    getCourseLecture: builder.query({
      query: (courseId) => ({
        url: `/${courseId}/lecture`,
        method: "GET",
      }),
      providesTags: ["Refetch_Lecture"],
    }),
    editLecture: builder.mutation({
      query: ({
        lectureTitle,
        videoInfo,
        isPreviewFree,
        courseId,
        lectureId,
      }) => ({
        url: `/${courseId}/lecture/${lectureId}`,
        method: "PUT",
        body: { lectureTitle, videoInfo, isPreviewFree },
      }),
    }),
    removeLecture: builder.mutation({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refetch_Lecture", "CourseDetails"],
    }),
    getLectureById: builder.query({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "GET",
      }),
    }),
    publishCourse: builder.mutation({
      query: ({ courseId, query }) => ({
        url: `/${courseId}/publish?publish=${query}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "CourseDetails", id: courseId },
        "Refetch_Creator_Course",
      ],
    }),
    getSearchCourse: builder.query({
      query: ({ searchQuery = "", categories = [], sortByPrice = "" }) => {
        let queryString = `/search?query=${encodeURIComponent(searchQuery)}`;
        if (categories && categories.length > 0) {
          const categoriesString = categories.map(encodeURIComponent).join(",");
          queryString += `&categories=${categoriesString}`;
        }
        if (sortByPrice) {
          queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
        }
        return {
          url: queryString,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  usePublishCourseMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
  useEditLectureMutation,
  useGetCourseLectureQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useGetCreatorCourseQuery,
  useEditCourseMutation,
  useCreateLectureMutation,
  useGetPublishedCourseQuery,
  useGetSearchCourseQuery,
} = courseApi;