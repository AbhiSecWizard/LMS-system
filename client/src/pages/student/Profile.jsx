import React, { useEffect, useState } from "react";
import { useLoadUserQuery, useUpdateUserMutation } from "@/features/api/authApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Course from "./Course";
import { CourseSkeleton } from "./Courses";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Profile = () => {
  const { data, isLoading } = useLoadUserQuery();
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [updateUser, { data: updateUserData, isLoading: updateUserIsLoading, isError, error, isSuccess }] = useUpdateUserMutation();

  // Dialog open hone par name input ko default state dene ke liye
  useEffect(() => {
    if (data?.user) {
      setName(data.user.name || "");
    }
  }, [data]);

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(updateUserData?.message || "Profile Updated successfully!");
    }
    if (isError) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  }, [error, updateUserData, isSuccess, isError]);
     
  const updateHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }
    await updateUser(formData);
  };

  if (isLoading) return <ProfileSkeleton />;

  // 🟢 Dynamic Enrolled Courses Data Extract Kiya Backend Response Se
  const enrolledCourses = data?.user?.enrolledCourses || [];

  return (
    <div className="max-w-4xl mx-auto px-4 my-16">
      <h1 className="font-bold text-2xl text-center md:text-left">
        PROFILE
      </h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="w-24 h-24 md:h-32 md:w-32 ">
            <AvatarImage src={data?.user?.photoUrl || "https://github.com/shadcn.png"} />
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <h1 className="font-semibold text-gray-900 dark:text-gray-300">
            Name:{" "}
            <span className="font-normal text-gray-700 dark:text-gray-300">
              {data?.user?.name} 
            </span>
          </h1>
          <h1 className="font-semibold text-gray-900 dark:text-gray-300">
            Email:{" "}
            <span className="font-normal text-gray-700 dark:text-gray-300">
              {data?.user?.email} 
            </span>
          </h1>
          <h1 className="font-semibold text-gray-900 dark:text-gray-300">
            Role:{" "}
            <span className="font-normal text-gray-700 dark:text-gray-300">
              {data?.user?.role?.toUpperCase()} 
            </span>
          </h1>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded cursor-pointer mt-4">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text" 
                    placeholder="Name" 
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo</Label>
                  <Input
                    onChange={onChangeHandler}
                    type="file" 
                    accept="image/*" 
                    className="col-span-3 cursor-pointer"
                  />                                       
                </div>
              </div>
              <DialogFooter>
                <Button disabled={updateUserIsLoading} onClick={updateHandler}>
                  {updateUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
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

      <div className="mt-10">
        <h1 className="font-semibold text-xl mb-4">
          Courses you are Enrolled In
        </h1>
        
        {/* 🟢 FIXED: Agar ek bhi course nahi hai, toh simple text. Agar hai, toh map function render hoga */}
        {enrolledCourses.length === 0 ? (
          <p className="text-gray-500 italic py-4">You have not enrolled in any courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
            {enrolledCourses.map((course) => (
              <Course course={course} key={course._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

// ProfileSkeleton Component
const ProfileSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 my-16">
      <Skeleton className="h-8 w-40 mb-6" />
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full" />
        <div className="space-y-4 w-full">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-6 w-72" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-32 mt-2" />
        </div>
      </div>
      <Skeleton className="h-6 w-64 mt-10" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <CourseSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};