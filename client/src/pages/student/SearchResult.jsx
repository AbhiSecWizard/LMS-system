import React from "react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => {
  // Safe Fallback properties
  const fallbackImage = "https://i.pinimg.com/736x/84/b1/e8/84b1e89db3f49799cfd6e84efa1a0474.jpg";
  
  return (
    <div className="flex flex-col md:flex-row justify-between border-b border-gray-200 py-4 gap-4 hover:bg-gray-50/50 transition-colors rounded-xl px-2">
      <Link 
        to={`/course-detail/${course?._id}`} 
        className="flex flex-col md:flex-row gap-4 w-full"
      >
        <img 
          src={course?.courseThumbnail || fallbackImage} 
          alt={course?.courseTitle || "Course Thumbnail"}
          className="h-32 w-full md:w-56 object-cover rounded-xl shadow-sm bg-gray-100"
        />
        
        <div className="flex flex-col flex-1 justify-between py-1">
          <div>
            <h1 className="font-bold text-lg md:text-xl text-gray-900 line-clamp-1">
              {course?.courseTitle || "Untitled Course"}
            </h1>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {course?.subTitle || "No summary description available for this course."}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Instructor: <span className="font-semibold text-gray-800">{course?.creator?.name || "Anonymous"}</span>
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-4 md:mt-2">
            <Badge className="w-fit" variant="secondary">
              {course?.level || "All Levels"}
            </Badge>
            <span className="font-bold text-emerald-600 text-lg">
              {course?.coursePrice ? `₹${course.coursePrice}` : "Free"}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SearchResult;