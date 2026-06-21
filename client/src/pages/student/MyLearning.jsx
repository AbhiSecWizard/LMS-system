import { Skeleton } from "@/components/ui/skeleton";
import Course from "./Course";
import { useLoadUserQuery } from "@/features/api/authApi";

const MyLearning = () => {
  // 🟢 Real data loading state aur data extract kiya RTK query se
let { data, isLoading } = useLoadUserQuery();
 
  // Backend se enrolled courses ka array nikala (fallback empty array ke sath)
  const myLearningCourses = data?.user?.enrolledCourses || [];

  return (
    <div className="max-w-7xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
      {/* Header section with clean design */}
      <div className="border-b border-gray-200 pb-5 mb-8">
        <h1 className="font-extrabold text-3xl text-gray-900 tracking-tight">
          My Learning
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Keep track of all the courses you are currently enrolled in.
        </p>
      </div>

      {/* 🟢 Fixed Grid Typography and Responsive Spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          // Jab data fetch ho raha ho toh skeleton loader dikhao
          Array.from({ length: 4 }).map((_, index) => (
            <MyLearningSkeleton key={index} />
          ))
        ) : myLearningCourses.length === 0 ? (
          // Jab user ne kisi course mein enroll nahi kiya ho
          <div className="col-span-full text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-gray-500 text-lg font-medium">
              You are not enrolled in any courses yet.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Explore the catalog and start your learning journey!
            </p>
          </div>
        ) : (
          // 🟢 Real Dynamic Data loop with correct props passed
          myLearningCourses.map((course) => (
            <Course course={course} key={course._id} />
          ))
        )}
      </div>
    </div>
  );
};

export default MyLearning;

// Beautiful Skeleton Component matching the dashboard theme
const MyLearningSkeleton = () => {
  return (
    <div className="bg-white border border-slate-100 shadow-sm rounded-xl overflow-hidden flex flex-col h-full animate-pulse">
      <Skeleton className="w-full aspect-video bg-slate-200" />
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <Skeleton className="h-4 w-1/3 rounded bg-slate-200" />
          <Skeleton className="h-6 w-full rounded bg-slate-200" />
          <Skeleton className="h-6 w-4/5 rounded bg-slate-200" />
        </div>
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full bg-slate-200" />
            <Skeleton className="h-4 w-20 rounded bg-slate-200" />
          </div>
          <Skeleton className="h-4 w-12 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  );
};