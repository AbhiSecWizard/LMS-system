import { Skeleton } from "@/components/ui/skeleton";
import Course from "./Course";

const MyLearning = () => {
    const myLearningCourses = [1,2,3,4,5]
    const isLoading = false
  return (
    <div className="max-w-6xl mx-auto my-10 px-4 md:px-0">
        <h1 className="font-bold text-2xl">My Learning</h1>
         <div className="grid gird-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:px-20 px-6 md:my-6">
            {isLoading
              ? Array.from({ length: 8 }).map((_, index) => {
                  return <MyLearningSkeleton key={index} />;
                })
              : myLearningCourses.length == 0 ? ("<p>you are not enrolled any course </p>"): myLearningCourses.map((_,index)=>{
                return (
                    <Course key={index}/>
                )
              })    
              }
          </div>
    </div>
    
  )
}

export default MyLearning
const MyLearningSkeleton = () => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
      <Skeleton className="w-full h-36" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};
