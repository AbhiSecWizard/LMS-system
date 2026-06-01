  import { useLoadUserQuery, useUpdateUserMutation } from "@/features/api/authApi"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
  import { Button } from "@/components/ui/button"
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { Loader2 } from "lucide-react"
  import Course, { CourseSkeleton } from "./Course"

  const Profile = () => {
    const {data,isLoading} = useLoadUserQuery()
    const [name,setName] = useState("")
    const [profilePhoto,setProfilePhoto] = useState("")
    const [updateUser,{data:updateUserData,isLoading:updateUserIsLoading,isError,error,isSuccess}] = useUpdateUserMutation()
    const enrolledCourses = [1,2]

    const onChangeHandler = (e)=>{
          const file = e.target.files?.[0]
          if(file){
            setProfilePhoto(file)
          }
    }
    
    
    useEffect(() => {
  if (isSuccess) {
    // Use updateUserData if available, otherwise fallback
    toast.success(updateUserData?.message || "Profile Updated successfully!");
  }
  if (isError) {
    // RTK Query errors usually live inside error.data.message
    toast.error(error?.data?.message || "Failed to update profile");
  }
}, [error, updateUserData, isSuccess, isError])
     
    const updateHandler = async ()=>{
      // console.log(name,profilePhoto)
      const formData = new FormData()
      formData.append("name",name)
      formData.append("profilePhoto",profilePhoto)
     await updateUser(formData)
    }
    if(isLoading ) return <ProfileSkeleton/>
    return (
      <div className="max-w-4xl mx-auto px-4 my-16">
          <h1 className="font-bold text-2xl text-center md:text-left">
              PROFILE
          </h1>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
              <div className="flex flex-col items-center">
                  <Avatar className="w-24 h-24 md:h-32 md:w-32 ">
              <AvatarImage src={data?.user.photoUrl || "https://github.com/shadcn.png"} />
              <AvatarFallback>AK</AvatarFallback>
            </Avatar>
              </div>
              <div className="">
                <h1 className="font-semibold text-gray-900 dark:text-gray-300">
                          Name:
                          <span className="font-normal text-gray-700 dark:text-gray-300">
                             {data?.user.name} 
                          </span>
                </h1>
                  <h1 className="font-semibold text-gray-900 dark:text-gray-300">
                          Email:
                          <span className="font-normal text-gray-700 dark:text-gray-300">
                                     {data.user?.email} 
                          </span>
                </h1>
                  <h1 className="font-semibold text-gray-900 dark:text-gray-300">
                          Role:
                          <span className="font-normal text-gray-700 dark:text-gray-300">
                                    {data.user?.role} 
                          </span>
                </h1>
                <Dialog>
                        <DialogTrigger asChild>
                          <Button className={"rounded cursor-pointer"}>
                            Edit Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Edit Profile
                                  </DialogTitle>
                                  <DialogDescription>
                                    Make changes to profile here .Click save when you're done.
                                  </DialogDescription>

                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                          <Label>Name</Label>
                                          <Input
                                            value={name}
                                           onChange={(e)=>setName(e.target.value)}
                                          type={"text"} placeholder={"Name"} className={"col-span-3"}/>

                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                          <Label>Profile Photo</Label>
                                         <Input
                    onChange={onChangeHandler}
                    type={"file"} 
                    accept={"image/*"} 
                    className={"col-span-3"}

                    // ✅ FIXED: value={profilePhoto} ko yahan se uda diya hai!
                  />                                       
                                    </div>

                                </div>
                                <DialogFooter>
                                  {/* // 🟢 FIX: isLoading (jo profile data fetch karne ka hai) ki jagah updateUserIsLoading use karein */}
<Button disabled={updateUserIsLoading} onClick={updateHandler}>
  {updateUserIsLoading ? (
    <>
      <Loader2 className="mr-4 h-4 w-4 animate-spin" /> Please wait
    </>
  ) : (
    "Save Changes"
  )}
</Button>
                                </DialogFooter>
                        </DialogContent>
                </Dialog>
          </div>
          </div>
          <h1 className="font-medium text-lg ">
            Courses you are Enrolled 
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5 ">
                  {
                    data.user.enrolledCourses.length === 0 ?"You have not enrolled Courses in " : enrolledCourses.map((course)=>{
                      return <>
                      <Course course={course} key={course.id}/>
                      </>
                    })
                  }
          </div>

      </div>
    )
  }

  export default Profile


  // ProfileSkeleton.jsx
  import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { useEffect, useState } from "react"

  const ProfileSkeleton = () => {
    return (
      <div className="max-w-4xl mx-auto px-4 my-16">
        <Skeleton className="h-8 w-40 mb-6" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
          {/* Avatar */}
          <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full" />

          {/* User Info */}
          <div className="space-y-4 w-full">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-6 w-72" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-32 mt-2" />
          </div>
        </div>

        {/* Courses title */}
        <Skeleton className="h-6 w-64 mt-10" />

        {/* Courses grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <CourseSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }
