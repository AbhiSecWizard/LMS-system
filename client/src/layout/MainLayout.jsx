import Navbar from "@/components/Navbar"
import { Outlet } from "react-router-dom"

const MainLayout = () => {
  return (
    // 🟢 FIXED: Added proper global background and text transitions for stable light/dark support
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0A0A0A] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Global Navbar */}
      <Navbar />
      
      {/* Page Content Container */}
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout