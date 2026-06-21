import  { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { CheckCircle, CirclePlay } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardTitle } from "./ui/card";
import { useParams } from "react-router-dom";
import { useGetCourseProgressQuery, useUpdateLectureProgressMutation } from "@/features/courseProgressApi";

export default function CourseProgress() {
  const params = useParams();
  const courseId = params.courseId;
  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);
  const [updateLectureProgress] = useUpdateLectureProgressMutation();

  const [currentLecture, setCurrentLecture] = useState(null);

  const courseDetails = data?.data?.courseDetails;
  const progress = data?.data?.progress || [];
  const isCourseCompleted = data?.data?.completed;
  const lectures = courseDetails?.lectures || [];

  useEffect(() => {
    if (lectures.length > 0 && typeof lectures[0] === "object" && !currentLecture) {
      setCurrentLecture(lectures[0]);
    }
  }, [data, lectures, currentLecture]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-medium animate-pulse text-gray-600">Loading course dashboard...</p>
      </div>
    );
  }

  if (isError || !courseDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-medium text-red-500">Failed to load course details</p>
      </div>
    );
  }

  const checkLectureStatus = (lectureId) => {
    if (!lectureId) return false;
    const found = progress.find((p) => p.lectureId?.toString() === lectureId.toString());
    return found ? found.viewed : false;
  };

  // 🌟 NEXT LECTURE LOGIC (Pass direct parameter to avoid old state closure)
  const moveToNextLecture = (activeLecture) => {
    const targetLecture = activeLecture || currentLecture;
    if (!targetLecture) return;

    const currentIdx = lectures.findIndex((l) => l._id?.toString() === targetLecture._id?.toString());
    if (currentIdx !== -1 && currentIdx < lectures.length - 1) {
      const nextLecture = lectures[currentIdx + 1];
      setCurrentLecture(nextLecture);
    } else {
      console.log("Course Completed 🎉");
    }
  };

  // 🌟 STRICT CONTROLLED SEQUENCING
  const handleVideoEnded = async () => {
    if (!currentLecture) return;
    
    // Save current active state before switching reference
    const lectureToSave = currentLecture;

    try {
      console.log("Saving progress for:", lectureToSave._id);
      
      // 1. Backend hit and await response strictly
      await updateLectureProgress({ 
        courseId, 
        lectureId: lectureToSave._id 
      }).unwrap();
      
      console.log("Progress saved successfully!");
      
      // 2. Refetch raw data right away 
      await refetch();
      
    } catch (error) {
      console.error("Backend progress update failed:", error);
    } finally {
      // 3. Sab khatam hone ke baad hi next video chalu hoga
      moveToNextLecture(lectureToSave);
    }
  };



  return (
    <div className="max-w-7xl mx-auto p-4 mt-20">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 bg-slate-50 p-4 rounded-xl border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">{courseDetails.courseTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">{courseDetails.subTitle}</p>
        </div>
        <Button 
          variant={isCourseCompleted ? "default" : "outline"}
          className={isCourseCompleted ? "bg-green-600 hover:bg-green-700 text-white border-none shadow-sm" : "border-slate-300 text-slate-700"}
        >
          {isCourseCompleted ? "Course Completed 🎉" : "In Progress"}
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Video Player */}
        <div className="flex-1 lg:w-3/5 h-fit rounded-2xl border border-slate-100 shadow-md p-4 bg-white">
          <div className="aspect-video w-full bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center text-white mb-4 relative shadow-inner">
            {currentLecture?.videoUrl ? (
              <video 
                src={currentLecture.videoUrl} 
                controls 
                autoPlay 
                onEnded={handleVideoEnded} 
                className="w-full h-full object-cover"
                key={currentLecture._id} 
              />
            ) : (
              <div className="text-center p-6">
                <CirclePlay size={48} className="mx-auto mb-2 text-slate-600" />
                <p className="text-slate-400 text-sm">Select a lecture to start streaming</p>
              </div>
            )}
          </div>
          
          <div className="p-1">
            <Badge className="mb-2 bg-blue-50 text-blue-600 border-none px-2.5 py-1">
              {courseDetails.category}
            </Badge>
            <h3 className="font-bold text-xl text-slate-800">
              {currentLecture?.lectureTitle || "Welcome to the Course"}
            </h3>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col w-full lg:w-2/5 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-6 pt-4 lg:pt-0 max-h-[75vh]">
          <div className="mb-4">
            <h2 className="font-bold text-lg text-slate-800">Course Curriculum</h2>
            <p className="text-xs text-slate-400 mt-0.5">{lectures.length} Total Modules</p>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {lectures.map((lecture, idx) => {
              const isObject = typeof lecture === "object";
              const lectureId = isObject ? lecture._id : lecture;
              const title = isObject ? lecture.lectureTitle : `Module Item ${idx + 1}`;
              
              const isCompleted = checkLectureStatus(lectureId);
              const isActive = currentLecture?._id?.toString() === lectureId?.toString();

              return (
                <Card 
                  key={lectureId} 
                  onClick={() => isObject && setCurrentLecture(lecture)}
                  className={`transition-all duration-200 border border-slate-100 shadow-sm ${
                    !isObject ? "opacity-70 cursor-not-allowed bg-slate-50/50" : "cursor-pointer hover:border-blue-200 hover:shadow"
                  } ${isActive ? "border-blue-500 bg-blue-50/40 ring-1 ring-blue-500/20" : ""}`}
                >
                  <CardContent className="flex items-center justify-between p-4 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {isCompleted ? (
                        <CheckCircle size={22} className="text-emerald-500 shrink-0" />
                      ) : (
                        <CirclePlay size={22} className={isActive ? "text-blue-500 shrink-0" : "text-slate-400 shrink-0"} />
                      )}
                      <div className="truncate">
                        <CardTitle className={`text-sm font-semibold truncate ${isActive ? "text-blue-700" : "text-slate-700"}`}>
                          {idx + 1}. {title}
                        </CardTitle>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isCompleted ? (
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none font-medium">
                          Completed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-400 border-slate-200 bg-white font-medium">
                          In Progress
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}