import { FaReact } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/90 z-50">
      
      {/* Main Loader */}
      <div className="relative flex items-center justify-center">
        
        {/* Outer Ring */}
        <div className="w-32 h-32 rounded-full border-4 border-t-cyan-400 border-r-purple-500 border-b-pink-500 border-l-transparent animate-spin"></div>

        {/* Inner Ring */}
        <div className="absolute w-20 h-20 rounded-full border-4 border-t-blue-500 border-b-cyan-300 border-l-transparent border-r-transparent animate-[spin_2s_linear_infinite_reverse]"></div>

        {/* React Icon */}
        <FaReact className="absolute text-cyan-400 text-5xl animate-spin duration-[4000ms]" />
      </div>

      {/* Loading Text */}
    </div>
  );
};

export default LoadingSpinner;