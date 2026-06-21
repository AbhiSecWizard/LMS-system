import Login from "./pages/Login";
import HeroSection from "./pages/student/HeroSection";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Courses from "./pages/student/Courses";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import Sidebar from "./pages/admin/Sidebar";
import Dashboard from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/course/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetail from "./pages/student/CourseDetail";
import PaymentSuccess from "./pages/student/PaymentSuccess";
import PaymentFailed from "./pages/student/PaymentFailed";
import CourseProgress from "./components/CourseProgress";
import SearchPage from "./pages/student/SearchPage";

// Protected Route Shielding Components
import ProtectRoutes, {
  Authenticated,
  AdminRoute,
} from "./components/ProtectRoutes";
import PurchaseCourseProtected from "./components/PurchaseCourseProtected";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // Public Open Slates Routes
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
      {
        path: "course-detail/:courseId",
        element: <CourseDetail />,
      },

      // Guest Exclusive Access Gates
      {
        path: "login",
        element: (
          <Authenticated>
            <Login />
          </Authenticated>
        ),
      },

      // Authenticated Student Protected Zones
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
      {
        path: "my-learning",
        element: (
          <ProtectRoutes>
            <MyLearning />
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
        path: "my-learning/course-detail/:courseId",
        element: (
          <ProtectRoutes>
            <CourseDetail />
          </ProtectRoutes>
        ),
      },

      // High Security Double-Vault Layer (Session Guard + Purchase Validation Ledger)
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

      // Premium Instructor Admin Node Cluster
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