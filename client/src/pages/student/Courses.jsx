import { useGetPublishedCourseQuery } from "@/features/courseApi";
import { Skeleton } from "@/components/ui/skeleton";
import Course from "./Course";

const Courses = () => {
  const { data, isLoading, isError, error } = useGetPublishedCourseQuery();
  console.log(data?.courses);
  const courses = data?.courses || [];

  if (isError) {
    return (
      <h1 className="text-center font-semibold text-red-500 mt-10 px-4">
        {error?.data?.message || "Failed to load courses"}
      </h1>
    );
  }

  return (
    // 🟢 FIXED: Light mode में हल्का ग्रे और Dark mode में Premium Slate/Black बैकग्राउंड
    <div className="bg-slate-50 dark:bg-[#0A0A0A] min-h-screen transition-colors duration-300 py-12">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Section Heading: Supported for both themes */}
        <h2 className="font-extrabold text-2xl sm:text-3xl lg:text-4xl text-center mb-10 text-slate-900 dark:text-slate-100 tracking-tight">
          Our Courses
        </h2>

        {/* Courses Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <Course key={course._id} course={course} />
            ))
          ) : (
            <h2 className="col-span-full text-center font-medium text-lg text-slate-500 dark:text-slate-400 mt-12">
              No Courses Available
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;


// ==========================================
// COURSE SKELETON (🟢 FULLY DARK MODE OPTIMIZED)
// ==========================================
export const CourseSkeleton = () => {
  return (
    // 🟢 FIXED: Card background & border for smooth transitions in dark mode
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 p-1.5 flex flex-col justify-between h-full animate-pulse">
      
      {/* Course Image Skeleton */}
      <Skeleton className="w-full h-44 rounded-xl bg-slate-200 dark:bg-slate-800" />

      {/* Card Content Skeleton */}
      <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
        
        {/* Title Lines */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-11/12 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-5 w-2/3 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Instructor Info Group */}
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-4 w-24 rounded-md bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Price Tag Skeleton */}
        <div className="pt-2 flex items-center justify-between">
          <Skeleton className="h-6 w-16 rounded-md bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-5 w-12 rounded-md bg-slate-200 dark:bg-slate-800" />
        </div>
        
      </div>
    </div>
  );
};