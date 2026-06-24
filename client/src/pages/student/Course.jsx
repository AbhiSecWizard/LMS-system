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
      <Card className="group h-[400px] overflow-hidden rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
        
        {/* Bigger Thumbnail */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-100">
          <img
            src={
              course?.courseThumbnail ||
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
            }
            alt={course?.courseTitle || "Course Thumbnail"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
        </div>

        {/* Content */}
        <CardContent className="px-4 py-3 flex flex-col flex-1 justify-between">
          <div>
            {/* Category */}
            {course?.category && (
              <Badge
                variant="secondary"
                className="mb-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-50 border-0 text-[10px] uppercase"
              >
                {course.category}
              </Badge>
            )}

            {/* Title */}
            <h2 className="text-sm font-semibold text-slate-800 line-clamp-2 min-h-[40px] group-hover:text-indigo-600 transition-colors">
              {course?.courseTitle || "Untitled Course"}
            </h2>

            {/* Instructor */}
            <div className="flex items-center gap-3 mt-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={course?.creator?.photoUrl}
                  alt={course?.creator?.name}
                />
                <AvatarFallback>
                  {course?.creator?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">
                  {course?.creator?.name || "Unknown Instructor"}
                </p>
                <p className="text-xs text-slate-400">
                  Instructor
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <Badge
                variant="outline"
                className={`${getLevelStyle(
                  course?.courseLevel
                )} text-[11px] px-2 py-1`}
              >
                {course?.courseLevel || "All Levels"}
              </Badge>

              <div className="flex items-center gap-1 text-xs text-slate-500">
                <BookOpen className="w-4 h-4" />
                <span>{course?.lectures?.length || 0} Lectures</span>
              </div>
            </div>
                  
            {/* Price */}
            <div className="mt-3 flex justify-between items-center">
              <span className="text-xs uppercase text-slate-400">
                Price
              </span>
              <div className="flex items-center font-bold text-lg">
                <IndianRupee className="w-4 h-4" />
                <span>
                  {course?.coursePrice?.toLocaleString("en-IN") || 0}
                </span>
              </div>
            </div>
          </div>
        </CardContent>

      </Card>
    </Link>
  );
};

export default Course;