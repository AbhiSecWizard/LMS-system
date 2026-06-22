// const userModel = require("../models/user.model");
// const bcryptjs = require("bcryptjs");
// const generateToken = require("../utils/generateToken");
// const { deleteMediaFromCloudinary, uploadMedia } = require("../utils/cloudinary");

// const register = async (req, res) => {
//     try {
//         let { name, email, password } = req.body;
//         if (!name || !email || !password) {
//             return res.status(400).json({ success: false, message: "All fields are required" });
//         }
         
//         let user = await userModel.findOne({ email });
//         if (user) {
//             return res.status(400).json({ success: false, message: "User Already exists" });
//         }
         
//         email = email.toLowerCase().trim();
//         let hashPassword = await bcryptjs.hash(password, 10);

//         const newUser = await userModel.create({
//             name: name.trim(),
//             email,
//             password: hashPassword
//         });

//         return generateToken(res, newUser, "User created and logged in successfully");

//     } catch (error) {
//         console.log("error from user register ", error);
//         return res.status(500).json({ success: false, message: "Failed to register" });
//     }
// };

// const login = async (req, res) => {
//     try {
//         let { email, password } = req.body;
    
//         if (!email || !password) {
//            return res.status(400).json({
//                 success: false,
//                 message: "All fields are required"
//             });
//         }
        
//         let user = await userModel.findOne({ email });
//         if (!user) {
//            return res.status(400).json({
//                 success: false,
//                 message: "invalid email or password"
//             });
//         }
        
//         const verify = await bcryptjs.compare(password, user.password);
//         if (!verify) {
//            return res.status(400).json({
//                 success: false,
//                 message: "invalid email or password"
//             });
//         }
//         generateToken(res, user, `welcome back ${user.name}`);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to Login "
//         });
//     }
// };

// const logout = async (req, res) => {
//   try {
//     res.cookie("token", "", {
//       httpOnly: true,
//       expires: new Date(0),
//       sameSite: "none", // ya "lax" jo login me use kiya hai
//       secure: true,     // login ke according
//       path: "/",
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Logout successfully",
//     });

//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to logout",
//     });
//   }
// };
// const getUserProfile = async (req, res) => {
//     try {
//         const userId = req.id;
//         const user = await userModel.findById(userId).select("-password").populate("enrolledCourses");
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "profile not found "
//             });
//         }
//         return res.status(200).json({
//             success: true,
//             user
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to load user"
//         });
//     }
// };

// const upadteUserProfile = async (req, res) => {
//     try {
//         const userId = req.id;
//         const { name } = req.body;
//         const profilePhoto = req.file;
        
//         const user = await userModel.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 message: "User not Found ",
//                 success: false
//             });
//         }

//         if (user.photoUrl) {
//             const urlParts = user.photoUrl.split('/');
//             const filenameWithExtension = urlParts.pop(); 
//             const filename = filenameWithExtension.split('.')[0]; 
            
//             const folderName = urlParts.slice(urlParts.indexOf('upload') + 2).join('/');
//             const publicId = folderName ? `${folderName}/${filename}` : filename;

//             console.log("Deleting Public ID 👉", publicId);
//             await deleteMediaFromCloudinary(publicId); 
//         }

//         let photoUrl = user.photoUrl; 
//         if (profilePhoto) {
//             const cloudResponse = await uploadMedia(profilePhoto.path);
//             photoUrl = cloudResponse.secure_url;
//         }

//         const updateData = { name, photoUrl };
//         const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");  
        
//         return res.status(200).json({
//             success: true,
//             user: updatedUser,
//             message: "Profile updated successfully"
//         });
//     } catch (error) {
//         console.log("error from updateUserProfile", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to update Profile"
//         });
//     }
// };

// const userControllers = { register, login, logout, getUserProfile, upadteUserProfile };
// module.exports = userControllers;


const userModel = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const { deleteMediaFromCloudinary, uploadMedia } = require("../utils/cloudinary");

const register = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
         
        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "User Already exists" });
        }
         
        email = email.toLowerCase().trim();
        let hashPassword = await bcryptjs.hash(password, 10);

        const newUser = await userModel.create({
            name: name.trim(),
            email,
            password: hashPassword
        });

        return generateToken(res, newUser, "User created and logged in successfully");

    } catch (error) {
        console.log("error from user register ", error);
        return res.status(500).json({ success: false, message: "Failed to register" });
    }
};

const login = async (req, res) => {
    try {
        let { email, password } = req.body;
    
        if (!email || !password) {
           return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        
        let user = await userModel.findOne({ email });
        if (!user) {
           return res.status(400).json({
                success: false,
                message: "invalid email or password"
            });
        }
        
        const verify = await bcryptjs.compare(password, user.password);
        if (!verify) {
           return res.status(400).json({
                success: false,
                message: "invalid email or password"
            });
        }
        generateToken(res, user, `welcome back ${user.name}`);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to Login "
        });
    }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "none", 
      secure: true,     
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};

// ==========================================
// GET USER PROFILE CONTROLLER (🟢 UPDATED WITH NESTED POPULATE)
// ==========================================
const getUserProfile = async (req, res) => {
    try {
        const userId = req.id;
        
        // 🟢 FIXED: Enrolled courses के अंदर से creator का name और photoUrl भी निकाल लिया है
        const user = await userModel.findById(userId)
            .select("-password")
            .populate({
                path: "enrolledCourses",
                populate: {
                    path: "creator",
                    select: "name photoUrl"
                }
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "profile not found "
            });
        }
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to load user"
        });
    }
};

const upadteUserProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { name } = req.body;
        const profilePhoto = req.file;
        
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not Found ",
                success: false
            });
        }

        if (user.photoUrl) {
            const urlParts = user.photoUrl.split('/');
            const filenameWithExtension = urlParts.pop(); 
            const filename = filenameWithExtension.split('.')[0]; 
            
            const folderName = urlParts.slice(urlParts.indexOf('upload') + 2).join('/');
            const publicId = folderName ? `${folderName}/${filename}` : filename;

            console.log("Deleting Public ID 👉", publicId);
            await deleteMediaFromCloudinary(publicId); 
        }

        let photoUrl = user.photoUrl; 
        if (profilePhoto) {
            const cloudResponse = await uploadMedia(profilePhoto.path);
            photoUrl = cloudResponse.secure_url;
        }

        const updateData = { name, photoUrl };
        const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");  
        
        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Profile updated successfully"
        });
    } catch (error) {
        console.log("error from updateUserProfile", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update Profile"
        });
    }
};

const userControllers = { register, login, logout, getUserProfile, upadteUserProfile };
module.exports = userControllers;