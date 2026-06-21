import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * 1. Global Private Route Wrapper
 * Stops unauthenticated users from accessing student dashboard/profile pages.
 */
const ProtectRoutes = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((store) => store.auth);

  // Robust check: Redux boot/re-hydration runtime block layer
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#0A0A0A]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * 2. Authenticated Guest Guard
 * Anti-back-button logic: Logged-in users are blocked from re-visiting /login or /signup.
 */
export const Authenticated = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((store) => store.auth);

  if (isLoading) return null; // Avoid quick layout layout-shifts

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * 3. Strict Admin/Instructor Boundary
 * Verifies both session and granular permission claims with robust string fallback parsing.
 */
export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useSelector((store) => store.auth);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#0A0A0A]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Prevents case-mismatch issues (e.g., 'Instructor' vs 'instructor')
  if (user?.role?.toLowerCase() !== "instructor") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectRoutes;