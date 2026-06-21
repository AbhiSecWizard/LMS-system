import { useGetCourseWithStatusQuery } from "@/features/purchaseApi";
import { Navigate, useParams } from "react-router-dom";

/**
 * Content Protection Layer
 * Intercepts video/lecture requests ensuring clear transaction ledger status exists.
 */
const PurchaseCourseProtected = ({ children }) => {
  const { courseId } = useParams();
  
  // Dynamic network assertion status hooks
  const { data, isLoading, isError } = useGetCourseWithStatusQuery(courseId, {
    skip: !courseId, // Idiomatic skip to bypass wrong endpoints routing
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#0A0A0A]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Safe Fallback fallback boundary system: if API throws 401 or data isn't paid
  if (isError || !data?.purchased) {
    return <Navigate to={`/course-detail/${courseId}`} replace />;
  }

  return children;
};

export default PurchaseCourseProtected;