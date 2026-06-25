import { Menu, School, SquareArrowRightExit } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  BookOpen,
  User,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { useEffect } from "react";
import { toast } from "sonner";
import {  useSelector } from "react-redux";
const Navbar = () => {
  // const user =true
  const {user} = useSelector(store=>store.auth)  

  const [logoutUser,{data,isSuccess}] = useLogoutUserMutation()
  const navigate = useNavigate()
  const logoutHandler = async ()=>{
    await logoutUser()
    navigate("/login")
  }
 console.log(user)
  
 useEffect(() => {
  if (isSuccess) {
    toast.success(data.message || "Logout successfully");
  }
}, [isSuccess, data]);
  const DropManuListClass = "hover:bg-gray-400 cursor-pointer transition-all duration-300"
  return (
    <div className="h-16 dark:bg-[#0A0A0A] dark:text-white bg-white text-black border-b dark:border-b-gray-800">
      {/* {desktop} */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <div className="flex items-center gap-2 cursor-pointer" onClick={()=>navigate("/")}>
          <School size={"30"} />
          <h1 className="hidden md:block font-extrabold text-2xl">
            E-Learning
          </h1>
        </div>
          {
        user ? 
        <div className="flex items-center gap-2.5">
        <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
  <AvatarImage src={`${user?.photoUrl || "https://github.com/shadcn.png"}  `} />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 rounded dark:bg-black dark:text-white text-black bg-white " align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel className=" md:text-xl font-bold">My Account</DropdownMenuLabel>
          <DropdownMenuItem className={`${DropManuListClass}`}>
           <Link to="my-learning">
            My Learning
           </Link>
          
          </DropdownMenuItem>
          <DropdownMenuItem className={`${DropManuListClass}`}>
          <Link to="profile">
          Edit Profile
          </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className={`flex items-center justify-between ${DropManuListClass}`} onClick={logoutHandler}>
            Logout <SquareArrowRightExit/>
          </DropdownMenuItem>
               <DropdownMenuSeparator/>
               <div className=" cursor-pointer flex w-full items-center justify-center hover:bg-blue-400 transition-all duration-200 ">
            {
              user?.role === "instructor" && (
                <Button className={"cursor-pointer"}><span className="text-red cursor-pointer" onClick={()=>navigate("/admin/dashboard")}>Dashboard</span></Button>
              )
            }
            </div>
          </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
            <DarkMode/> 
        </div> : <div className="flex items-center gap-2">
  <Button onClick={()=>navigate("/login")} variant="outline" className={"dark:bg-black/50  dark:text-white text-white bg-blue-400 hover:bg-blue-600 transition-all duration-200"}>Login</Button>
  <Button onClick={()=>navigate("/login")}>Signup</Button>
   <DarkMode/>
</div>
      }
      </div>
                      
      <MobileNavbar/>    
      <div>
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();

  const logoutHandler = async () => {
    try {
      await logoutUser().unwrap();
      toast.success("Logout Successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout Failed");
    }
  };

  const menuItems = [
    {
      title: "My Learning",
      icon: BookOpen,
      path: "/my-learning",
    },
    {
      title: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  return (
    <div className="md:hidden absolute top-3 right-3 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-xl"
          >
            <Menu />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-[280px] border-none bg-[#1F2937] text-white p-0"
        >
          {/* Profile Section */}
          <div className="px-6 pt-16 pb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-pink-400">
                <AvatarImage
                  src={
                    user?.photoUrl ||
                    "https://github.com/shadcn.png"
                  }
                />
                <AvatarFallback>
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div>
                <h3 className="font-semibold text-lg">
                  {user?.name || "Guest User"}
                </h3>

                <p className="text-sm text-gray-400">
                  {user?.role || "Student"}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700" />

          {/* Menu */}
          <div className="px-4 py-6 flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.title}
                onClick={() => navigate(item.path)}
                className="
                  flex items-center gap-4
                  px-4 py-3
                  rounded-xl
                  text-gray-300
                  hover:bg-white/10
                  hover:text-white
                  transition-all
                "
              >
                <item.icon size={20} />
                <span>{item.title}</span>
              </button>
            ))}

            {user?.role === "instructor" && (
              <button
                onClick={() =>
                  navigate("/admin/dashboard")
                }
                className="
                  flex items-center gap-4
                  px-4 py-3
                  rounded-xl
                  text-gray-300
                  hover:bg-white/10
                  hover:text-white
                  transition-all
                "
              >
                <LayoutDashboard size={20} />
                Dashboard
              </button>
            )}
          </div>

          {/* Bottom Section */}
          <div className="mt-auto px-4 py-6 border-t border-gray-700">
            <div className="mb-4">
              <DarkMode />
            </div>

            <button
              onClick={logoutHandler}
              className="
                flex items-center gap-4
                w-full
                px-4 py-3
                rounded-xl
                text-red-400
                hover:bg-red-500/10
                transition-all
              "
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};