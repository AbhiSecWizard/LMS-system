

//   const course = require("../models/course.model");
// const Course = require("../models/course.model"); 
//   const Lecture = require("../models/lecture.model");
//   //  FIXED: Properly destructure the functions from your cloudinary utility
//   const { uploadMedia, deleteMediaFromCloudinary } = require("../utils/cloudinary");

//   // ==========================================
//   // CREATE COURSE CONTROLLER
//   // ==========================================
//   const createCourse = async (req, res) => {
//     try {
//       const { courseTitle, category } = req.body;
      
//       if (!courseTitle || !category) {
//         return res.status(400).json({
//           message: 'Course Title and Category are required'
//         });
//       } 

//       const course = await Course.create({
//         courseTitle,
//         category,
//         creator: req.id // Populated by your isAuthenticated middleware
//       });

//       return res.status(201).json({
//         course,
//         message: "Course created successfully"
//       });

//     } catch (error) {
//       console.error("Error creating course:", error);
//       return res.status(500).json({
//         message: 'Failed to create course'
//       });
//     }
//   };

//   // ==========================================
//   // GET CREATOR COURSES CONTROLLER
//   // ==========================================
//   const getCreatorCourses = async (req, res) => {
//     try {
//       const userId = req.id;
//       const courses = await Course.find({ creator: userId }); 
      
//       if (!courses || courses.length === 0) {
//         return res.status(404).json({
//           message: "Courses not found",
//           courses: []
//         });
//       }
      
//       //  FIXED: Corrected success message context for fetching data
//       return res.status(200).json({
//         courses,
//         message: "Courses fetched successfully"
//       });
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       return res.status(500).json({ 
//         message: "Failed to fetch courses" 
//       });
//     }
//   };

//   // ==========================================
//   // EDIT COURSE CONTROLLER
//   // ==========================================
//   const editCourse = async (req, res) => {
//     try {
//       const courseId = req.params.courseId;
//       const { courseTitle, subTitle, description, category, coursePrice, courseLevel } = req.body;
//       const thumbnail = req.file;

//       let course = await Course.findById(courseId);
//       if (!course) {
//         return res.status(404).json({ // Changed to 404 for clarity
//           message: "Course not found"
//         });
//       }

//       let courseThumbnail = course.courseThumbnail; //  Default back to existing thumbnail if no new file is sent

//       if (thumbnail) {
//         // If an old thumbnail exists in Cloudinary, delete it first
//         if (course.courseThumbnail) {
//           const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
//           await deleteMediaFromCloudinary(publicId); //  FIXED: Spelling corrected with an "i"
//         }
        
//         // Upload new file
//         const uploadResponse = await uploadMedia(thumbnail.path);
//         if (uploadResponse) {
//           courseThumbnail = uploadResponse.secure_url;
//         }
//       }
      
//       const updateData = {
//         courseTitle,
//         subTitle,
//         description,
//         category,
//         coursePrice,
//         courseLevel,
//         courseThumbnail // Will update with new URL or retain old one cleanly
//       };

//       course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
      
//       //  FIXED: Changed res.stutus to res.status
//       return res.status(200).json({
//         course,
//         message: "Course updated successfully"
//       });

//     } catch (error) {
//       console.error("Error updating course:", error);
//       //  FIXED: Changed res.stutus to res.status and fixed message context
//       return res.status(500).json({
//         message: "Failed to update course"
//       });
//     }
//   };

//   const getCourseId = async (req,res)=>{
//     try {
//       const {courseId} = req.params
//       const course  = await Course.findById(courseId)
//       if(!course){
//         return res.status(404).json({
//           message:"Course not Found!"
//         })
//       }
//       return res.status(200).json({
//         course
//       })
//     } catch (error) {
      
//     }
//   }
  
//   const getPublishedCourse = async ( req,res)=>{
//         try {
//           const courses = await Course.find({isPublished:true}).populate({path:"creator",select:"name photoUrl"})
//           if(!courses){
//             return res.status(404).json({
//               message:"Course not found "
//             })
//           }
//           return res.status(200).json({
//             courses,
//           })
//         } catch (error) {
//           console.log(error)
//           return res.status(500).json({
//             message:"server error"
//           })
//         }
//   }
 
//   // ==========================================
//   // CREATE LECTURE 
//   // ==========================================
//   // const Lecture = require("../models/lecture.model");
//   const createLecture = async (req, res) => {
//     try {
//       const { lectureTitle } = req.body;
//       const { courseId } = req.params;

//       if (!lectureTitle || !courseId) {
//         return res.status(400).json({
//           message: "Lecture title is required",
//         });
//       }

//       const lecture = await Lecture.create({
//         lectureTitle,
//       });

//       const course = await Course.findById(courseId);

//       if (course) {
//         course.lectures.push(lecture._id);
//         await course.save();
//       }

//       return res.status(201).json({
//         lecture,
//         message: "Lecture created successfully",
//       });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({
//         message: "Failed to create lecture",
//       });
//     }
//   };
//   // ==========================================
//   // CREATE GET LECTURE 
//   // ==========================================
//   const getCourseLecture = async (req,res)=>{
  
//   try {
//       const {courseId} = req.params
//     const course = await Course.findById(courseId).populate("lectures")
//     if(!course){
//       return res.status(404).json({
//         message:"Course not found"
//       });
//     }
//     return res.status(200).json({
//       lectures:course.lectures 
//     })
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//     message: "Failed to get Lecture",
    
//     });
//   }  
//   }
// const editLecture = async (req, res) => {
//   try {
//     const { lectureId } = req.params;
//     const { lectureTitle, videoInfo, isPreviewFree } = req.body;

//     // 1. Pehle lecture check karein ki exist karta hai ya nahi
//     let lecture = await Lecture.findById(lectureId);
//     if (!lecture) {
//       return res.status(404).json({
//         success: false,
//         message: "Lecture not found",
//       });
//     }

//     // 2. Data ko update karein (Agar data frontend se aaya hai tabhi purane ko replace karein)
//     if (lectureTitle) lecture.lectureTitle = lectureTitle;
//     if (isPreviewFree !== undefined) lecture.isPreviewFree = isPreviewFree;

//     // 🟢 CRITICAL FIX: videoInfo se data nikal kar model ke fields me map karna
//     if (videoInfo && videoInfo.videoUrl && videoInfo.publicId) {
//       lecture.videoUrl = videoInfo.videoUrl;
//       lecture.publicId = videoInfo.publicId;
//     }

//     // 3. Database mein save karein
//     await lecture.save();

//     return res.status(200).json({
//       success: true,
//       lecture,
//       message: "Lecture updated successfully!",
//     });

//   } catch (error) {
//     console.error("Error from editLecture Controller:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to update lecture due to server error",
//     });
//   }
// };
// const removeLecture =async (req,res)=>{
//   try {
//     const {lectureId} = req.params
//     const lecture = await Lecture.findByIdAndDelete(lectureId)
//     if(!lecture){
//       return res.status(404).json({
//         message:"Lecture not found",
//       })
//     }
//     if(lecture.publicId){
//       await deleteMediaFromCloudinary(lecture.publicId)
//     }
//     // remove the lecture from the associated course
//     await Course.updateOne({lectures:lectureId}, // find the course that contains the 
//       {$pull:{lectures:lectureId}} // Remove the lectures id from db
//     ) 
//     return res.status(200).json({
//       message:"lecture remove successfully"
//     })
//   } catch (error) {
//     return res.status(500).json({
//      message:"Fialed to get update"
//   })
//   }
// }
// const getLectureById = async (req, res) => {
//   try {
//     const { lectureId } = req.params; 
//     const lecture = await Lecture.findById(lectureId);
    
//     if (!lecture) {
//       return res.status(404).json({
//         success: false,
//         message: "Lecture not Found"
//       }); 
//     }
    
//     return res.status(200).json({
//       success: true,
//       lecture
//     });
//   } catch (error) {
//     console.error("Error fetching lecture by ID:", error); // Fixed 'errpr' typo
//     return res.status(500).json({
//       success: false,
//       message: "Failed to get lecture by ID"
//     });
//   }
// };

// const togglePublishCourse = async (req,res)=>{
//    try {
//     const {courseId} = req.params;
//     const {publish} = req.query; // true and false 
//     const course= await Course.findById(courseId);
//     if(!course){
//       return res.status(404).json({
//         message:"Course not found"
//       })
//     }
//     // publish status based on the query parameter
//     course.isPublished = publish === "true"
//     await course.save()
//     const statusMessage = course.isPublished ? "Published" : "Unpublished"
//     return res.status(200).json({
//        message:`Course Is ${statusMessage}` 
//     }) 
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({
//         message:"course status not update"
//     })
//    }
// }


// const searchCourse = async (req, res) => {
//   try {
//     // 1. Destructure fields with default fallbacks
//     let { query = "", categories = "", sortByPrice = "" } = req.query;

//     // 2. Base Search Criteria
//     const searchCriteria = {
//       isPublished: true,
//       $or: [
//         { courseTitle: { $regex: query, $options: "i" } },
//         { subTitle: { $regex: query, $options: "i" } },
//         { category: { $regex: query, $options: "i" } }
//       ]
//     };

//     // 3. 🟢 FIX: Convert comma-separated string back into a real array for Mongoose
//     if (categories) {
//       const categoriesArray = categories.split(",");
//       if (categoriesArray.length > 0) {
//         searchCriteria.category = { $in: categoriesArray };
//       }
//     }

//     // 4. Define Sorting Order
//     const sortOptions = {};
//     if (sortByPrice === "low") {
//       sortOptions.coursePrice = 1;  // Ascending (Low to High)
//     } else if (sortByPrice === "high") {
//       sortOptions.coursePrice = -1; // Descending (High to Low)
//     }

//     // 5. 🟢 FIX: Use 'courses' (plural) uniformly, and catch empty results safely
//     const courses = await Course.find(searchCriteria)
//       .populate({ path: "creator", select: "name photoUrl" })
//       .sort(sortOptions);

//     return res.status(200).json({
//       success: true,
//       courses: courses || [] // Fixed variable typo from 'course' to 'courses'
//     });

//   } catch (error) {
//     // 🟢 FIX: Corrected typo 'consoloe' to 'console'
//     console.log("Error from searchCourse controller: ", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server encountered an error processing your search request."
//     });
//   }
// };


//   const courseControllers = {searchCourse,getPublishedCourse,editLecture,togglePublishCourse,removeLecture,getLectureById, createCourse,createLecture,getCourseLecture,getCreatorCourses,editCourse,getCourseId};
//   module.exports = courseControllers;
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

const courseControllers = { searchCourse, getPublishedCourse, editLecture, togglePublishCourse, removeLecture, getLectureById, createCourse, createLecture, getCourseLecture, getCreatorCourses, editCourse, getCourseId };
module.exports = courseControllers;