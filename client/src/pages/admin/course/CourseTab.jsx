import { useEffect, useState } from "react";
import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditCourseMutation, useGetCourseByIdQuery } from "@/features/courseApi";
import { toast } from "sonner";

const CourseTab = () => {
  const navigate = useNavigate();
  const { courseId } = useParams(); 
  
  const { data: courseByIdData, isLoading: courseByIdLoading } = useGetCourseByIdQuery(courseId);
  const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation();
  
  const isPublished = false;

  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    coursePrice: "",
    courseLevel: "",
    courseThumbnail: null,
  });

  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const course = courseByIdData?.course;

  useEffect(() => {
    if (course) {
      setInput({
        courseTitle: course.courseTitle || "",
        subTitle: course.subTitle || "",
        description: course.description || "",
        category: course.category || "",
        coursePrice: course.coursePrice || "",
        courseLevel: course.courseLevel || "",
        courseThumbnail: null, 
      });
      
      if (course.courseThumbnail) {
        setPreviewThumbnail(course.courseThumbnail);
      }
    }
  }, [course]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const selectCategory = (value) => {
    setInput((prev) => ({ ...prev, category: value }));
  };

  const selectCourseLevel = (value) => {
    setInput((prev) => ({ ...prev, courseLevel: value }));
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0]; 
    if (file) {
      setInput((prev) => ({ ...prev, courseThumbnail: file }));
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewThumbnail(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const saveHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    
    if (input.courseThumbnail) {
      formData.append("courseThumbnail", input.courseThumbnail);
    }
        
    await editCourse({ courseId, formData });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course updated successfully.");
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to update course.");
    }
  }, [isSuccess, error, data]);

  if (courseByIdLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Basic Course Information</CardTitle>
            <CardDescription>
              Make changes to your course here and save them.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <Button variant="destructive">
              Remove Course
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-5">
          <div>
            <Label>Course Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Full Stack Developer"
            />
          </div>

          <div>
            <Label>Subtitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Become a Full Stack Developer from Zero to Hero"
            />
          </div>

          <div>
            <Label>Description</Label>
            {/* RichTextEditor component calling cleanly with fixed HTML lifecycle binding */}
            <RichTextEditor input={input} setInput={setInput} />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <Label>Category</Label>
              <Select value={input.category} onValueChange={selectCategory}>
                <SelectTrigger className="w-full h-12 rounded-xl">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Categories</SelectLabel>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="App Development">App Development</SelectItem>
                    <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                    <SelectItem value="Backend Development">Backend Development</SelectItem>
                    <SelectItem value="Full Stack Development">Full Stack Development</SelectItem>
                    <SelectItem value="JavaScript">JavaScript</SelectItem>
                    <SelectItem value="React JS">React JS</SelectItem>
                    <SelectItem value="Node JS">Node JS</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Course Level</Label>
              <Select value={input.courseLevel} onValueChange={selectCourseLevel}>
                <SelectTrigger className="w-full h-12 rounded-xl">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Price in (INR)</Label>
            <Input 
              type="number"
              name="coursePrice"
              value={input.coursePrice}
              onChange={changeEventHandler}
              placeholder="199"
            />
          </div>
          
          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={selectThumbnail}
              className="w-fit"
              name="courseThumbnail"
            />
            {previewThumbnail && (
              <div className="mt-2">
                <img 
                  src={previewThumbnail} 
                  className="w-64 h-auto object-cover rounded border" 
                  alt="course_thumbnail"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" type="button" onClick={() => navigate("/admin/course")}>
              Cancel
            </Button>
            
            <Button disabled={isLoading} onClick={saveHandler} type="button">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;