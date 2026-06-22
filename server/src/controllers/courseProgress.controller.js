const Course = require("../models/course.model");
const CourseProgress = require("../models/courseProgress");

// 1. GET COURSE PROGRESS
const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const [courseDetails, courseProgress] = await Promise.all([
      Course.findById(courseId).populate("lectures"),
      CourseProgress.findOne({ courseId, userId })
    ]);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!courseProgress) {
      return res.status(200).json({
        success: true,
        data: { 
          courseDetails,
          progress: [],
          completed: false,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });

  } catch (error) {
    console.error("Error in getCourseProgress:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 2. UPDATE LECTURES PROGRESS (🌟 CRITICAL BUG FIXES HERE)
const updateLecturesProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;

    const courseDetails = await Course.findById(courseId);
    if (!courseDetails) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
      });
    }

    // 🟢 Bulletproof lookup fallback matching string structures safely
    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lecture) => lecture.lectureId && lecture.lectureId.toString() === lectureId.toString()
    );

    if (lectureIndex !== -1) {
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      courseProgress.lectureProgress.push({
        lectureId: lectureId,
        viewed: true,
      });
    }

    courseProgress.markModified("lectureProgress");

    const viewedLecturesCount = courseProgress.lectureProgress.filter((lp) => lp.viewed).length;
    courseProgress.completed = courseDetails.lectures.length === viewedLecturesCount;

    await courseProgress.save();
    
    return res.status(200).json({
      success: true,
      message: "Lecture progress updated successfully",
      data: courseProgress
    });

  } catch (error) {
    console.error("Error in updateLecturesProgress:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
// 3. MARK COURSE AS COMPLETED
const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const [courseDetails, courseProgressRecord] = await Promise.all([
      Course.findById(courseId).populate("lectures"),
      CourseProgress.findOne({ courseId, userId })
    ]);

    if (!courseDetails) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    let courseProgress = courseProgressRecord;

    if (!courseProgress) {
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: true,
        lectureProgress: [],
      });
    }

    courseDetails.lectures.forEach((lecture) => {
      const exists = courseProgress.lectureProgress.find(
        (lp) => lp.lectureId.toString() === lecture._id.toString()
      );
      if (exists) {
        exists.viewed = true;
      } else {
        courseProgress.lectureProgress.push({ lectureId: lecture._id, viewed: true });
      }
    });
    
    courseProgress.markModified("lectureProgress");
    courseProgress.completed = true;
    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Course marked as completed successfully",
    });

  } catch (error) {
    console.error("Error in markAsCompleted:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// 4. MARK COURSE AS INCOMPLETE
const maskAsInCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress tracking profile not found",
      });
    }

    courseProgress.lectureProgress.forEach((lecture) => {
      lecture.viewed = false;
    });

    courseProgress.markModified("lectureProgress");
    courseProgress.completed = false;
    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Course marked as incomplete successfully",
    });

  } catch (error) {
    console.error("Error in maskAsInCompleted:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const courseProgressController = {
  getCourseProgress,
  updateLecturesProgress,
  markAsCompleted,
  maskAsInCompleted,
};

module.exports = courseProgressController;