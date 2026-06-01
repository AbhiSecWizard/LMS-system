// // 1. Pay attention to how you import this
// const Course = require("../models/course.model"); 
// const { uploadMedia, deleteMediaFromCloudinary } = require("../utils/cloudinary");

// // create course controller
// const createCourse = async (req, res) => {
//   try {
//     const { courseTitle, category } = req.body;
    
//     if (!courseTitle || !category) {
//       return res.status(400).json({
//         message: 'Course Title and Category are required'
//       });
//     } 

//     // 2. This will now work perfectly because 'Course' matches the variable above
//     const course = await Course.create({
//       courseTitle,
//       category,
//       creator: req.id // Ensure your authentication middleware populates req.id
//     });

//     return res.status(201).json({
//       course,
//       message: "Course created successfully"
//     });

//   } catch (error) {
//     console.error("Error creating course:", error);
//     return res.status(500).json({
//       message: 'Failed to create course'
//     });
//   }
// };


// const getCreatorCourses = async (req,res)=>{
//           try {
//             const userId = req.id;
//             const courses = await Course.find({creator:userId}) 
//              if(!courses){
//               return  res.status(404).json({
//                 message:"course not found",
//                 course:[]
//               })
//              }
//              return res.status(200).json({ courses, message: "Course updated successfully" })
//           } catch (error) {
//             console.log(error)
            
//             return res.status(500).json({ message: "Failed to update course" })
//           }
// }


// const editCourse= async (req,res)=>{
//    try {
//       const courseId = req.params.courseId

//      const {courseTitle,subTitle,description,category,coursePrice,courseLevel} = req.body
//      const thumbnail = req.file

//      let course= await Course.findById(courseId)
//      if(!course){
//       return res.status(400).json({
//            message:"Course not found"
//       })
//      }
//      let courseThumbnail;
//      if(thumbnail){
//       if(course.courseThumbnail){

//         const publicId = course.courseThumbnail.split("/").pop().split(".")[0]
//          await deleteMediaFromCloudnery(publicId) // delete old image
//       }
//       courseThumbnail = await uploadMedia(thumbnail.path)
//       }
     
//       const updateData = {courseTitle,subTitle,description,category,coursePrice,courseLevel,courseThumbnail:courseThumbnail?.secure_url}
//       course = await Course.findByIdAndUpdate(courseId,updateData,{new:true})
//         return res.stutus(200).json({
//           course ,
//           message:"Course updated successfully"
//         })
//    } catch (error) {
//       console.log(error)
//           return res.stutus(500).json({
//           message:"Failed to create course"
//          })
//    }

// }  

// const courseControllers = { createCourse,getCreatorCourses ,editCourse};
// module.exports = courseControllers; 


const Course = require("../models/course.model"); 
//  FIXED: Properly destructure the functions from your cloudinary utility
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
// GET CREATOR COURSES CONTROLLER
// ==========================================
const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.id;
    const courses = await Course.find({ creator: userId }); 
    
    if (!courses || courses.length === 0) {
      return res.status(404).json({
        message: "Courses not found",
        courses: []
      });
    }
    
    //  FIXED: Corrected success message context for fetching data
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
      return res.status(404).json({ // Changed to 404 for clarity
        message: "Course not found"
      });
    }

    let courseThumbnail = course.courseThumbnail; //  Default back to existing thumbnail if no new file is sent

    if (thumbnail) {
      // If an old thumbnail exists in Cloudinary, delete it first
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId); //  FIXED: Spelling corrected with an "i"
      }
      
      // Upload new file
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
      courseThumbnail // Will update with new URL or retain old one cleanly
    };

    course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
    
    //  FIXED: Changed res.stutus to res.status
    return res.status(200).json({
      course,
      message: "Course updated successfully"
    });

  } catch (error) {
    console.error("Error updating course:", error);
    //  FIXED: Changed res.stutus to res.status and fixed message context
    return res.status(500).json({
      message: "Failed to update course"
    });
  }
};

const courseControllers = { createCourse, getCreatorCourses, editCourse };
module.exports = courseControllers;