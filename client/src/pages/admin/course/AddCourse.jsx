// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useCreateCourseMutation } from "@/features/courseApi";
// import { Loader2 } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// const AddCourse = () => {
//   const [courseTitle,setCourseTitle] = useState("");
//   const [category,setCategory] = useState("");
//   const navigate = useNavigate();
//   // const isLoading = false
//   const [createCourse,{data,error,isSuccess,isLoading}]=useCreateCourseMutation()
  
//  function getSelectedCategory (value){
//    setCategory(value)
//  }
//  async function createCourseHandler (){
//  await createCourse({courseTitle,category})
// }

// useEffect(()=>{
//   if(isSuccess){
//     toast.success(data?.message || "Course Created")
//   }
//   if(error){
//     toast.error(error.message || "course creation failed")
//   }
// },[error,isSuccess])
//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-[#0A0A0A] py-10 px-4">
//       <div className="max-w-3xl mx-auto bg-white dark:bg-[#161616] shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-8">        
//         {/* Heading */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
//             Add New Course
//           </h1>
//           <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
//             Add basic details for your new course. You can edit advanced
//             settings later from the dashboard.
//           </p>
//         </div>
//         {/* Form */}
//         <div className="space-y-6">
//           {/* Course Title */}
//           <div className="space-y-2">
//             <Label
//               htmlFor="courseTitle"
//               className="text-sm font-semibold"
//             >
//               Course Title
//             </Label>
//             <Input
//               type="text"
//               id="courseTitle"
//               value={courseTitle}
//               name="courseTitle"
//               onChange={(e)=>setCourseTitle(e.target.value)}
//               placeholder="Enter your course title"
//               className="h-12 rounded-xl"
//             />
//           </div>
//           {/* Course Category */}
//           <div className="space-y-2">
//             <Label
//               htmlFor="courseCategory"
//               className="text-sm font-semibold"
//             >
//               Course Category
//             </Label>
//             <Select onValueChange={getSelectedCategory}>
//               <SelectTrigger className="w-full h-12 rounded-xl">
//                 <SelectValue placeholder="Select Category" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectLabel>Course Categories</SelectLabel>
//                   <SelectItem value=" Web Development">
//                     Web Development
//                   </SelectItem>
//                   <SelectItem value="App Development">
//                     App Development
//                   </SelectItem>
//                   <SelectItem value="Frontend Development">
//                     Frontend Development
//                   </SelectItem>
//                   <SelectItem value="Backend Development">
//                     Backend Development
//                   </SelectItem>
//                   <SelectItem value="Full Stack Development">
//                     Full Stack Development
//                   </SelectItem>
//                   <SelectItem value="JavaScript">
//                     JavaScript
//                   </SelectItem>
//                   <SelectItem value="React JS">
//                     React JS
//                   </SelectItem>
//                   <SelectItem value="Node JS">
//                     Node JS
//                   </SelectItem>
//                   <SelectItem value="Python">
//                     Python
//                   </SelectItem>
//                   <SelectItem value="Java">
//                     Java
//                   </SelectItem>
//                   <SelectItem value="Data Science">
//                     Data Science
//                   </SelectItem>
//                   <SelectItem value="Machine Learning">
//                     Machine Learning
//                   </SelectItem>
//                   <SelectItem value="Artificial Intelligence">
//                     Artificial Intelligence
//                   </SelectItem>
//                   <SelectItem value="Cyber Security">
//                     Cyber Security
//                   </SelectItem>
//                   <SelectItem value="Ui/Ux Design">
//                     UI/UX Design
//                   </SelectItem>
//                   <SelectItem value="Graphic Design">
//                     Graphic Design
//                   </SelectItem>

//                   <SelectItem value="Digital Marketing">
//                     Digital Marketing
//                   </SelectItem>

//                   <SelectItem value="Video Editing">
//                     Video Editing
//                   </SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Buttons */}
//           <div className="flex items-center justify-end gap-4 pt-4">
//             <Button
//               onClick={() => navigate("/admin/course")}
//               variant="outline"
//               className="rounded-xl px-6 cursor-pointer"
//             >
//               Back
//             </Button>

//             <Button disabled={isLoading === true}  onClick={createCourseHandler} className="rounded-xl px-6 cursor-pointer">
//              {isLoading ? (
//               <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
//               </>
//               ) : "Create Course"
//               }
//             </Button>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddCourse;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCourseMutation } from "@/features/courseApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  // RTK Query Mutation Hook
  const [createCourse, { data, error, isSuccess, isLoading }] = useCreateCourseMutation();

  function getSelectedCategory(value) {
    setCategory(value);
  }

  async function createCourseHandler() {
    // Basic validation check before firing API request
    if (!courseTitle.trim()) {
      toast.error("Please enter a course title");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    await createCourse({ courseTitle, category });
  }

  // Handle Response Side-effects
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course Created Successfully!");
      setCourseTitle(""); // Form states reset
      setCategory("");
      navigate("/admin/course"); // Redirect back to dashboard list immediately
    }
    if (error) {
      // safe extraction of rtk query error msg
      toast.error(error?.data?.message || error?.message || "Course creation failed");
    }
  }, [error, isSuccess, data, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0A0A0A] py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#161616] shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-8">        
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Add New Course
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
            Add basic details for your new course. You can edit advanced
            settings later from the dashboard.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Course Title */}
          <div className="space-y-2">
            <Label htmlFor="courseTitle" className="text-sm font-semibold">
              Course Title
            </Label>
            <Input
              type="text"
              id="courseTitle"
              value={courseTitle}
              name="courseTitle"
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="Enter your course title"
              className="h-12 rounded-xl"
            />
          </div>

          {/* Course Category */}
          <div className="space-y-2">
            <Label htmlFor="courseCategory" className="text-sm font-semibold">
              Course Category
            </Label>
            <Select onValueChange={getSelectedCategory} value={category}>
              <SelectTrigger className="w-full h-12 rounded-xl">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Course Categories</SelectLabel>
                  {/* Fixed: Removed extra leading space from value attribute */}
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="App Development">App Development</SelectItem>
                  <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                  <SelectItem value="Backend Development">Backend Development</SelectItem>
                  <SelectItem value="Full Stack Development">Full Stack Development</SelectItem>
                  <SelectItem value="JavaScript">JavaScript</SelectItem>
                  <SelectItem value="React JS">React JS</SelectItem>
                  <SelectItem value="Node JS">Node JS</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="Java">Java</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                  <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                  <SelectItem value="Cyber Security">Cyber Security</SelectItem>
                  <SelectItem value="Ui/Ux Design">UI/UX Design</SelectItem>
                  <SelectItem value="Graphic Design">Graphic Design</SelectItem>
                  <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                  <SelectItem value="Video Editing">Video Editing</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Button
              onClick={() => navigate("/admin/course")}
              variant="outline"
              className="rounded-xl px-6 cursor-pointer"
            >
              Back
            </Button>

            <Button 
              disabled={isLoading} 
              onClick={createCourseHandler} 
              className="rounded-xl px-6 cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                "Create Course"
              )}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddCourse;