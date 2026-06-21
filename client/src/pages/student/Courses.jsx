import { useGetPublishedCourseQuery } from "@/features/courseApi";
import { Skeleton } from "@/components/ui/skeleton";
import Course from "./Course";

const Courses = () => {
  const { data, isLoading, isError, error } =
    useGetPublishedCourseQuery();
  console.log(data?.courses)
  const courses = data?.courses || [];

  if (isError) {
    return (
      <h1 className="text-center text-red-500 mt-10">
        {error?.data?.message || "Failed to load courses"}
      </h1>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-3xl text-center mb-10">
          Our Courses
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <Course key={course._id} course={course} />
            ))
          ) : (
            <h2 className="col-span-full text-center text-gray-500">
              No Courses Available
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;



export const CourseSkeleton = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md">
      <Skeleton className="w-full h-40" />

      <div className="p-4 space-y-4">
        <Skeleton className="h-6 w-3/4" />

        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-5 w-28" />
        </div>

        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
};

