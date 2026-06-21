import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lecture } from "../lecture/Lecture";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/courseApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  const [createLecture, { data, isLoading, isSuccess, error }] =
    useCreateLectureMutation();
  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
    refetch
  } = useGetCourseLectureQuery(courseId);
  const createLectureHandler = async () => {
    "";
    await createLecture({ lectureTitle, courseId });
  };

  console.log("searching for lecture data :-", lectureData);

  useEffect(() => {
    if (isSuccess) {
      refetch()
      toast.success(data?.message);
    }

    if (error) {
      toast.error(
        error?.data?.message || error?.message || "Something went wrong",
      );
    }
  }, [isSuccess, error, data]);
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0A0A0A] py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#161616] shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Add New Lecture
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
            Add basic details for your Lecture.
          </p>
        </div>
        {/* Form */}
        <div className="space-y-6">
          {/* Course Title */}
          <div className="space-y-2">
            <Label htmlFor="lectureTitle" className="text-sm font-semibold">
              Course Title
            </Label>
            <Input
              type="text"
              id="lectureTitle"
              value={lectureTitle}
              name="lectureTitle"
              onChange={(e) => setLectureTitle(e.target.value)}
              placeholder="Enter your course title"
              className="h-12 rounded-xl"
            />
          </div>
          {/* Course Category */}
          {/* Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Button
              onClick={() => navigate(`/admin/course/${courseId}`)}
              variant="outline"
              className="rounded-xl px-6 cursor-pointer"
            >
              Back
            </Button>
            <Button
              disabled={isLoading === true}
              onClick={createLectureHandler}
              className="rounded-xl px-6 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Create Lecture"
              )}
            </Button>
          </div>
     {lectureLoading ? (
  <p>Loading lecture ... </p>
) : lectureError ? ( // 1. Fixed duplicate condition bug here
  <p>Failed to load lecture</p>
) : !lectureData || !lectureData.lectures || lectureData.lectures.length === 0 ? ( // 2. Added safe checks
  <p>No lecture available</p>
) : (
  // 3. Fixed .map() target and moved the 'key' to the outermost element (<> fragments shouldn't hold keys unless written as <Fragment>)
  lectureData.lectures.map((lecture, index) => (
    <Lecture
      key={lecture._id}
      lecture={lecture}
      courseId={courseId}
      index={index}
    />
  ))
)}
        </div>
      </div>
    </div>
  );
};
export default CreateLecture;
