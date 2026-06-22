import { Menu, School, SquareArrowRightExit } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  
  return (
    <div className="h-16 dark:bg-[#0A0A0A] bg-white border-b dark:border-b-gray-800">
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
      <DropdownMenuContent className="w-40 rounded-xl" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-black md:text-xl font-bold">My Account</DropdownMenuLabel>
          <DropdownMenuItem>
           <Link to="my-learning">
            My Learning
           </Link>
          
          </DropdownMenuItem>
          <DropdownMenuItem>
          <Link to="profile">
          Edit Profile
          </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center justify-between" onClick={logoutHandler}>
            Logout <SquareArrowRightExit/>
          </DropdownMenuItem>
               <DropdownMenuSeparator/>
               <div className="flex w-full items-center justify-center">
            {
              user?.role === "instructor" && (
                <Button><span className="text-red" onClick={()=>navigate("/admin/dashboard")}>Dashboard</span></Button>
              )
            }
            </div>
          </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
            <DarkMode/> 
        </div> : <div className="flex items-center gap-2">
  <Button onClick={()=>navigate("/login")} variant="outline">Login</Button>
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

const MobileNavbar = ()=>{
    const {user} = useSelector(store=>store.auth)  
  return (
<div className="md:hidden absolute top-3 right-3">
   <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline"><Menu/></Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>My Account</SheetTitle>
        </SheetHeader>
        <div className="grid">
           <Button className="flex justify-start focus:bg-gray-900">My Learning</Button>
          <Button className="flex justify-start focus:bg-gray-900">Edit Profile</Button>
          <Button className="flex justify-between  focus:bg-gray-900" > Logout <SquareArrowRightExit/></Button>
        </div>
        
          {user?.role === "Instructor" && (
             <div className="w-full flex justify-center bg-amber-200 py-4 rounded-xl my-6">
             <Button className="bg-blue-500 h-16 rounded-2xl text-2xl font-bold focus:bg-blue-900">
            Dashboard
          </Button>
           </div>
          )}
        
      </SheetContent>
    </Sheet>
</div>
  )
}