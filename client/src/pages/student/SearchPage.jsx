import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetSearchCourseQuery } from "@/features/courseApi";
import Filter from "./Filter";
import SearchResult from "./SearchResult";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  
  // Single Source of Truth for Filters
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  // RTK Query hook passing current active filters
  const { data, isLoading } = useGetSearchCourseQuery({
    searchQuery: query,
    categories: selectedCategories,
    sortByPrice: sortByPrice,
  });

  const courses = data?.courses || [];
  const isEmpty = !isLoading && courses.length === 0;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="my-6">
        <h1 className="text-xl font-bold">Results for "{query}"</h1>
        <p className="text-gray-500 text-sm">
          Showing results for{" "}
          <span className="text-blue-800 font-bold italic">"{query}"</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        {/* Left Section: Filter Sidebar */}
        <Filter 
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          sortByPrice={sortByPrice}
          setSortByPrice={setSortByPrice}
        />

        {/* Right Section: Results display */}
        <div className="flex-1">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <CourseSkeleton key={idx} />
            ))
          ) : isEmpty ? (
            <div className="text-center py-10">
              <h1 className="text-xl font-semibold text-gray-700">No courses found matching your criteria.</h1>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <SearchResult key={course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

// Shimmer Loader Component
const CourseSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-2xl bg-white shadow-sm animate-pulse mb-4 w-full">
      <div className="w-full md:w-56 h-36 bg-gray-200 rounded-xl shrink-0" />
      <div className="flex-1 flex flex-col justify-between py-1 space-y-3">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded-md w-3/4" />
          <div className="h-4 bg-gray-200 rounded-md w-1/2" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="h-4 bg-gray-200 rounded-md w-24" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 bg-gray-200 rounded-full w-20" />
          <div className="h-6 bg-gray-200 rounded-md w-16" />
        </div>
      </div>
    </div>
  );
};