import { ChartNoAxesColumn, SquareLibrary } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const Sidebar = () => {
  return (
    // 🟢 FULL WRAPPER: Main background and layout responsive colors
    <div className="flex min-h-screen bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* ==========================================
          DESKTOP SIDEBAR 
         ========================================== */}
      <div className="hidden lg:block w-[260px] bg-slate-50 dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-900 p-5 sticky top-16 h-[calc(100vh-4rem)] transition-colors duration-300">
        <div className="space-y-2 mt-4">
          
          {/* Dashboard NavLink */}
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 select-none ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-slate-100"
              }`
            }
          >
            <ChartNoAxesColumn size={20} />
            <span>Dashboard</span>
          </NavLink>

          {/* Courses NavLink */}
          <NavLink
            to="course"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 select-none ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-slate-100"
              }`
            }
          >
            <SquareLibrary size={20} />
            <span>Courses</span>
          </NavLink>

        </div>
      </div>

      {/* ==========================================
          MAIN CONTENT AREA (OUTLET)
         ========================================== */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Outlet />
      </div>

    </div>
  );
};

export default Sidebar;