import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const Sidebar = () => {
  
  
  
  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <div className="hidden lg:block w-[250px] bg-[#f0f0f0] border-r border-gray-300 p-5">
        <div className="space-y-4">

          <Link
            to="dashboard"
            className="flex items-center gap-2 hover:text-blue-500"
          >
            <ChartNoAxesColumn size={22} />
            <h1>Dashboard</h1>
          </Link>

          <Link
            to="course"
            className="flex items-center gap-2 hover:text-blue-500"
          >
            <SquareLibrary size={22} />
            <h1>Courses</h1>
          </Link>

        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5">
        <Outlet />
      </div>

    </div>
  );
};

export default Sidebar;