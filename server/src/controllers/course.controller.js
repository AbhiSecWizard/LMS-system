
const Course = require("../models/course.model"); 
const Lecture = require("../models/lecture.model");
const { uploadMedia, deleteMediaFromCloudinary } = require("../utils/cloudinary");

// ==========================================
// CREATE COURSE CONTROLLER
// ==========================================
const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;
    
    if (!courseTitle || !category) {
      return res.status(400).json({
        message: 'Course Title and Category are required'
      });
    } 

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.id // Populated by your isAuthenticated middleware
    });

    return res.status(201).json({
      course,
      message: "Course created successfully"
    });

  } catch (error) {
    console.error("Error creating course:", error);
    return res.status(500).json({
      message: 'Failed to create course'
    });
  }
};

// ==========================================
// GET CREATOR COURSES CONTROLLER (UPDATED)
// ==========================================
const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;
    // 🟢 FIXED: Added populate to fetch creator's name and photoUrl
    const courses = await Course.find({ creator: userId }).populate({ path: "creator", select: "name photoUrl" }); 
    
    if (!courses || courses.length === 0) {
      return res.status(404).json({
        message: "Courses not found",
        courses: []
      });
    }
    
    return res.status(200).json({
      courses,
      message: "Courses fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ 
      message: "Failed to fetch courses" 
    });
  }
};

// ==========================================
// EDIT COURSE CONTROLLER
// ==========================================
const editCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { courseTitle, subTitle, description, category, coursePrice, courseLevel } = req.body;
    const thumbnail = req.file;

    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    let courseThumbnail = course.courseThumbnail;

    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId);
      }
      
      const uploadResponse = await uploadMedia(thumbnail.path);
      if (uploadResponse) {
        courseThumbnail = uploadResponse.secure_url;
      }
    }
    
    const updateData = {
      courseTitle,
      subTitle,
      description,
      category,
      coursePrice,
      courseLevel,
      courseThumbnail
    };

    course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
    
    return res.status(200).json({
      course,
      message: "Course updated successfully"
    });

  } catch (error) {
    console.error("Error updating course:", error);
    return res.status(500).json({
      message: "Failed to update course"
    });
  }
};

// ==========================================
// REMOVE COURSE CONTROLLER (Naya Added 🟢)
// ==========================================
const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // 1. Pehle check karo course exist karta hai ya nahi
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 2. Cloudinary se Course Thumbnail remove karo (agar exist karta hai)
    if (course.courseThumbnail) {
      // Safe tarika publicId nikalne ka URL se
      const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId);
    }

    // 3. Is course se jude saare lectures ko dhoondho taaki unke videos delete kar sakein
    const lectures = await Lecture.find({ _id: { $in: course.lectures } });

    // Loop chalakar saare lectures ke videos Cloudinary se udao
    for (const lecture of lectures) {
      if (lecture.publicId) {
        await deleteMediaFromCloudinary(lecture.publicId);
      }
    }

    // 4. Database se saare associated Lectures ko ek sath delete karo
    await Lecture.deleteMany({ _id: { $in: course.lectures } });

    // 5. Finally primary Course document ko delete kar do
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course along with all its lectures deleted successfully!",
    });

  } catch (error) {
    console.error("Error from removeCourse controller:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course due to server error",
    });
  }
};
// ==========================================
// GET COURSE BY ID CONTROLLER (UPDATED)
// ==========================================
const getCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    // 🟢 FIXED: Added populate to fetch creator's data on course details page
    const course = await Course.findById(courseId).populate({ path: "creator", select: "name photoUrl" });
    if (!course) {
      return res.status(404).json({
        message: "Course not Found!"
      });
    }
    return res.status(200).json({
      course
    });
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// GET PUBLISHED COURSE CONTROLLER
// ==========================================
const getPublishedCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({ path: "creator", select: "name photoUrl" });
    if (!courses) {
      return res.status(404).json({
        message: "Course not found"
      });
    }
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "server error"
    });
  }
};

// ==========================================
// CREATE LECTURE CONTROLLER
// ==========================================
const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        message: "Lecture title is required",
      });
    }

    const lecture = await Lecture.create({ lectureTitle });
    const course = await Course.findById(courseId);

    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(201).json({
      lecture,
      message: "Lecture created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to create lecture",
    });
  }
};

// ==========================================
// GET COURSE LECTURES CONTROLLER
// ==========================================
const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }
    return res.status(200).json({
      lectures: course.lectures 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get Lecture"
    });
  }  
};

// ==========================================
// EDIT LECTURE CONTROLLER
// ==========================================
const editLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;

    let lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (isPreviewFree !== undefined) lecture.isPreviewFree = isPreviewFree;

    if (videoInfo && videoInfo.videoUrl && videoInfo.publicId) {
      lecture.videoUrl = videoInfo.videoUrl;
      lecture.publicId = videoInfo.publicId;
    }

    await lecture.save();

    return res.status(200).json({
      success: true,
      lecture,
      message: "Lecture updated successfully!",
    });
  } catch (error) {
    console.error("Error from editLecture Controller:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update lecture due to server error",
    });
  }
};

// ==========================================
// REMOVE LECTURE CONTROLLER
// ==========================================
const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
      });
    }
    if (lecture.publicId) {
      await deleteMediaFromCloudinary(lecture.publicId);
    }
    await Course.updateOne({ lectures: lectureId }, { $pull: { lectures: lectureId } }); 
    return res.status(200).json({
      message: "lecture remove successfully"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update"
    });
  }
};

// ==========================================
// GET LECTURE BY ID CONTROLLER
// ==========================================
const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params; 
    const lecture = await Lecture.findById(lectureId);
    
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not Found"
      }); 
    }
    
    return res.status(200).json({
      success: true,
      lecture
    });
  } catch (error) {
    console.error("Error fetching lecture by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get lecture by ID"
    });
  }
};

// ==========================================
// TOGGLE PUBLISH COURSE CONTROLLER
// ==========================================
const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query; 
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }
    course.isPublished = publish === "true";
    await course.save();
    const statusMessage = course.isPublished ? "Published" : "Unpublished";
    return res.status(200).json({
      message: `Course Is ${statusMessage}` 
    }); 
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "course status not update"
    });
  }
};

// ==========================================
// SEARCH COURSE CONTROLLER
// ==========================================
const searchCourse = async (req, res) => {
  try {
    let { query = "", categories = "", sortByPrice = "" } = req.query;

    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } }
      ]
    };

    if (categories) {
      const categoriesArray = categories.split(",");
      if (categoriesArray.length > 0) {
        searchCriteria.category = { $in: categoriesArray };
      }
    }

    const sortOptions = {};
    if (sortByPrice === "low") {
      sortOptions.coursePrice = 1;
    } else if (sortByPrice === "high") {
      sortOptions.coursePrice = -1;
    }

    const courses = await Course.find(searchCriteria)
      .populate({ path: "creator", select: "name photoUrl" })
      .sort(sortOptions);

    return res.status(200).json({
      success: true,
      courses: courses || []
    });

  } catch (error) {
    console.log("Error from searchCourse controller: ", error);
    return res.status(500).json({
      success: false,
      message: "Server encountered an error processing your search request."
    });
  }
};

const courseControllers = { searchCourse,removeCourse, getPublishedCourse, editLecture, togglePublishCourse, removeLecture, getLectureById, createCourse, createLecture, getCourseLecture, getCreatorCourses, editCourse, getCourseId };
module.exports = courseControllers;