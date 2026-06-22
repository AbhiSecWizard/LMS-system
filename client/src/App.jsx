import Login from "./pages/Login";
import HeroSection from "./pages/student/HeroSection";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "./layout/MainLayout";

// Student Pages
import Courses from "./pages/student/Courses";
import CourseDetail from "./pages/student/CourseDetail";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import SearchPage from "./pages/student/SearchPage";
import PaymentSuccess from "./pages/student/PaymentSuccess";
import PaymentFailed from "./pages/student/PaymentFailed";

// Admin Pages
import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/course/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";

// Components
import CourseProgress from "./components/CourseProgress";
import PurchaseCourseProtected from "./components/PurchaseCourseProtected";

import ProtectRoutes, {
  Authenticated,
  AdminRoute,
} from "./components/ProtectRoutes";


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [

      // =========================
      // Public Routes
      // =========================

      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        ),
      },

      {
        path: "course/search",
        element: <SearchPage />,
      },


      // =========================
      // Guest Routes
      // =========================

      {
        path: "login",
        element: (
          <Authenticated>
            <Login />
          </Authenticated>
        ),
      },


      // =========================
      // Student Protected Routes
      // =========================

      {
        path: "course-detail/:courseId",
        element: (
          <ProtectRoutes>
            <CourseDetail />
          </ProtectRoutes>
        ),
      },

      {
        path: "my-learning",
        element: (
          <ProtectRoutes>
            <MyLearning />
          </ProtectRoutes>
        ),
      },

      {
        path: "my-learning/course-detail/:courseId",
        element: (
          <ProtectRoutes>
            <CourseDetail />
          </ProtectRoutes>
        ),
      },

      {
        path: "profile",
        element: (
          <ProtectRoutes>
            <Profile />
          </ProtectRoutes>
        ),
      },

      {
        path: "payment-success",
        element: (
          <ProtectRoutes>
            <PaymentSuccess />
          </ProtectRoutes>
        ),
      },

      {
        path: "payment-failed",
        element: (
          <ProtectRoutes>
            <PaymentFailed />
          </ProtectRoutes>
        ),
      },


      // =========================
      // Purchased Course Access
      // =========================

      {
        path: "course-progress/:courseId",
        element: (
          <ProtectRoutes>
            <PurchaseCourseProtected>
              <CourseProgress />
            </PurchaseCourseProtected>
          </ProtectRoutes>
        ),
      },


      // =========================
      // Instructor Admin Routes
      // =========================

      {
        path: "admin",
        element: (
          <AdminRoute>
            <Sidebar />
          </AdminRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },

          {
            path: "course",
            element: <CourseTable />,
          },

          {
            path: "course/create",
            element: <AddCourse />,
          },

          {
            path: "course/:courseId",
            element: <EditCourse />,
          },

          {
            path: "course/:courseId/lecture",
            element: <CreateLecture />,
          },

          {
            path: "course/:courseId/lecture/:lectureId",
            element: <EditLecture />,
          },
        ],
      },

    ],
  },
]);


const App = () => {
  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
};

export default App;