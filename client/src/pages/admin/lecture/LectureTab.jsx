import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from "@/features/courseApi";
import { useParams, useNavigate } from "react-router-dom";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [videoInfo, setVideoInfo] = useState(null); 
  const [isPreviewFree, setIsPreviewFree] = useState(false); 
  const [uploadProgress, setUploadProgress] = useState(0); 
  const [mediaProgress, setMediaProgress] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);   
  
  const params = useParams();
  const navigate = useNavigate();
  const { courseId, lectureId } = params;

  // RTK Query hooks
  const { data: lectureData, isLoading: isLectureLoading } = useGetLectureByIdQuery(lectureId);
  const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation();
  const [removeLecture, { data: removeData, isSuccess: removeSuccess }] = useRemoveLectureMutation();

  const lecture = lectureData?.lecture;

  // 🟢 Existing lecture data ko component state me fill karna
  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle || "");
      setIsPreviewFree(lecture.isPreviewFree || false);
      if (lecture.videoUrl && lecture.publicId) {
        setVideoInfo({
          videoUrl: lecture.videoUrl,
          publicId: lecture.publicId
        });
      }
    }
  }, [lecture]);

  // Handle Remove Lecture
  async function removeLectureHandler() {
    if (window.confirm("Are you sure you want to delete this lecture?")) {
      await removeLecture(lectureId);
    }
  }

  // Handle Edit/Update Lecture
  async function editLectureHandler() {
    if (!lectureTitle.trim()) {
      toast.error("Lecture title is required");
      return;
    }
    await editLecture({ 
      lectureTitle, 
      videoInfo, 
      courseId, 
      lectureId, 
      isPreviewFree 
    });
  }

  // Update Toast response handlers
  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Lecture updated successfully!");
    } 
    if (error) {
      toast.error(error?.data?.message || "Something went wrong while updating lecture");
    }
  }, [isSuccess, error, data]);

  // Remove Toast response handlers
  useEffect(() => {
    if (removeSuccess) {
      toast.success(removeData?.message || "Lecture removed successfully!");
      navigate(`/admin/course/${courseId}/lecture`); // redirection handling as required
    }
  }, [removeSuccess, removeData, navigate, courseId]); 

  // File Upload Logic
  const handleFileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);
    
    setMediaProgress(true);
    setUploadProgress(0);
    setBtnDisable(true); // Disable save button while uploading

    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/media/upload-video`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        }
      );

      if (res.data.success) {
        setVideoInfo({
          videoUrl: res.data.data.secure_url, 
          publicId: res.data.data.public_id,
        });
        toast.success("Video uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Video upload failed");
    } finally {
      setMediaProgress(false);
      setBtnDisable(false);
    }
  };

  if (isLectureLoading) {
    return <div className="text-center py-10 text-muted-foreground">Loading Lecture details...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white border rounded-2xl shadow-sm p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Edit Lecture</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Edit lecture details and save your changes.
            </p>
          </div>
          <Button variant="destructive" onClick={removeLectureHandler} className="cursor-pointer">
            Remove Lecture
          </Button>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Lecture Title</Label>
          <Input 
            id="title" 
            placeholder="Enter lecture title" 
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
          />
        </div>

        {/* Video Upload */}
        <div className="space-y-2">
          <Label htmlFor="video">Upload Video</Label>
          <Input
            id="video"
            type="file"
            accept="video/*"
            onChange={handleFileChangeHandler}
            className="cursor-pointer"
            disabled={mediaProgress}
          />
          {videoInfo?.videoUrl && !mediaProgress && (
            <p className="text-xs text-green-6xl font-medium text-emerald-6xl mt-1 text-emerald-6xl">
              ✓ Video file is attached to this lecture.
            </p>
          )}
        </div>

        {/* Free Preview */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <h3 className="font-medium">Free Preview</h3>
            <p className="text-sm text-muted-foreground">
              Allow students to watch this lecture for free.
            </p>
          </div>
          <Switch 
            id="free-video" 
            checked={isPreviewFree} 
            onCheckedChange={setIsPreviewFree}
          />
        </div>
        
        {/* Progress Bar */}
        {mediaProgress && (
          <div className="space-y-2">
            <Progress value={uploadProgress} />
            <p className="text-xs text-muted-foreground text-center">
              {uploadProgress}% uploaded
            </p>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button 
            disabled={btnDisable || isLoading} 
            onClick={editLectureHandler}
          >
            {isLoading ? "Updating..." : "Update Lecture"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LectureTab;