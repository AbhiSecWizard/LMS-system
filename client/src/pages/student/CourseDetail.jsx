import { Button } from "@/components/ui/button";
import ReactPlayer from 'react-player';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useGetCourseWithStatusQuery } from "@/features/purchaseApi";
import { Separator } from "@base-ui/react";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import "./courseDetail.css";
import axios from "axios";
import { useState } from "react";

const CourseDetail = () => {
  // 1. ALL HOOKS MUST BE DECLARED AT THE TOP OF THE COMPONENT
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // RTK Query hook
  const { data, isLoading, isError, error } = useGetCourseWithStatusQuery(courseId);

  // 2. EARLY RETURNS ARE ONLY ALLOWED AFTER ALL HOOKS
  if (isLoading) {
    return <h1 className="mt-20 text-center text-lg font-medium text-gray-600">Loading course context...</h1>;
  }

  if (isError) {
    return (
      <h1 className="mt-20 text-center text-red-500 font-semibold">
        {error?.data?.message || "Failed to load course details"}
      </h1>
    );
  }

  // Destructure data safely
  const { course, purchased } = data || {};
  console.log("hello",course?.lectures[0].videoUrl)
  
  // Console logs for debugging
  console.log("📦 RAW RESPONSE FROM BACKEND API:", data);
  console.log("🎯 FINAL PURCHASED BOOLEAN STATUS:", purchased);

  // Handlers
  function handleContinueCourse() {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  }

  const purchaseCourseHandler = async () => {
    if (!courseId) {
      alert("Course ID missing!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/payment/initiate`,
        {
          courseId: courseId, 
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        window.location.href = response.data.checkoutUrl;
      }
        
    } catch (error) {
      console.error("Payment Error:", error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 space-y-5">
      {/* Top Header Banner */}
      <div className="bg-[#2d2f31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8">
          <h1 className="font-bold text-3xl">{course?.courseTitle}</h1>
          <p className="text-lg mt-2">{course?.subTitle}</p>
          <p className="mt-2">
            Created By <span className="text-[#c0c4fc] underline italic">{course?.creator?.name || "Unknown"}</span>
          </p>

          <div className="flex items-center gap-2 mt-2">
            <BadgeInfo size={16} />
            <p>Last Updated {course?.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : "N/A"}</p>
          </div>
          <p className="mt-2">Students Enrolled: {course?.enrolledStudents?.length || 0}</p>
        </div>
      </div>

      {/* Main Grid System */}
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        
        {/* Left Side Section */}
        <div className="w-full lg:w-2/3 space-y-5">
          <h1 className="font-bold text-2xl">Description</h1>
          <div>
            {course?.description ? (
              <div 
                className="course-html-render text-gray-700 bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            ) : (
              <p className="text-gray-500 italic">No description available for this course.</p>
            )}
          </div>

          <Card>
            <CardHeader>
              <h2 className="font-semibold">Course Content</h2>
              <CardDescription>{course?.lectures?.length || 0} Lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course?.lectures?.map((lecture) => (
                <div key={lecture._id} className="flex items-center gap-3 border-b pb-2 last:border-0">
                  {purchased ? (
                    <PlayCircle size={18} className="text-green-600" />
                  ) : (
                    <Lock size={18} className="text-gray-400" />
                  )}
                  <p className="text-gray-700 font-medium">{lecture.lectureTitle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Side Pricing Card */}
        <div className="w-full lg:w-1/3">
          <Card className="sticky top-24">
            <CardContent className="p-4">
              <div className="w-full aspect-video mb-4 overflow-hidden rounded-md bg-black">
                {/* ⚡ Added optional chaining below to safeguard videoUrl */}
                
                  <ReactPlayer
                    src={course?.lectures[0].videoUrl}
                    width={"100%"}
                    height={"100%"}
                    controls={true}
                  />
              </div>

              <h2 className="font-semibold text-lg">{course?.courseTitle}</h2>
              <Separator className="my-3 bg-gray-100 h-[1px]" />
              <h1 className="text-xl font-bold">₹ {course?.coursePrice || 0}</h1>
            </CardContent>

            <CardFooter className="p-4">
              {purchased ? (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded"
                  onClick={handleContinueCourse}
                >
                  Continue Course
                </Button>
              ) : (
                <Button onClick={purchaseCourseHandler} disabled={loading}>
                  {loading ? "Processing..." : "Purchase Course"}
                </Button>  
              )}
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default CourseDetail;