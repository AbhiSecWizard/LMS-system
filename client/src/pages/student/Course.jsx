import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";

const Course = ({ course }) => {
  const getLevelStyle = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "medium":
      case "intermediate":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "advance":
      case "advanced":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200/60";
    }
  };

  return (
   <Link to={`course-detail/${course?._id}`}>
     <Card className="group overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col h-full">
      
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={
            course?.courseThumbnail ||
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
          }
          alt={course?.courseTitle || "Course Thumbnail"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Subtle overlay for image contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none" />
      </div>

      {/* Card Content */}
      <CardContent className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category */}
          {course?.category && (
            <Badge 
              variant="secondary" 
              className="mb-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-50 font-medium border-0 tracking-wide uppercase text-[10px]"
            >
              {course.category}
            </Badge>
          )}

          {/* Title */}
          <h2 className="text-base font-semibold text-slate-800 line-clamp-2 min-h-[48px] leading-snug group-hover:text-indigo-600 transition-colors duration-200">
            {course?.courseTitle || "Untitled Course"}
          </h2>

          {/* Instructor Profile */}
          <div className="flex items-center gap-3 mt-4">
            <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-slate-100">
              <AvatarImage src={course?.creator?.photoUrl} alt={course?.creator?.name} />
              <AvatarFallback className="text-xs bg-slate-100 font-medium text-slate-600">
                {course?.creator?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-700 truncate">
                {course?.creator?.name || "Unknown Instructor"}
              </p>
              <p className="text-xs text-slate-400">
                Instructor
              </p>
            </div>
          </div>
        </div>

        {/* Footer Metrics Section */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between gap-2">
            
            {/* Level Tag */}
            <Badge 
              variant="outline" 
              className={`${getLevelStyle(course?.courseLevel)} font-medium px-2.5 py-0.5 rounded-md text-[11px]`}
            >
              {course?.courseLevel || "All Levels"}
            </Badge>

            {/* Lectures Count */}
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>{course?.lectures?.length || 0} Lectures</span>
            </div>
          </div>

          {/* Price Action Block */}
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Price
            </span>
            <div className="flex items-center font-bold text-slate-900 text-xl tracking-tight">
              <IndianRupee className="w-4 h-4 mr-0.5 text-slate-800 stroke-[2.5]" />
              <span>{course?.coursePrice?.toLocaleString("en-IN") || 0}</span>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
   </Link>
  );
};

export default Course;