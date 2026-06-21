const userModel = require("../models/user.model")
const bcryptjs = require("bcryptjs")
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

        // Naya user create karein
        const newUser = await userModel.create({
            name: name.trim(),
            email,
            password: hashPassword
        });

        // 🟢 FIX: Register hote hi token generate karein taaki user profile access kar sake
        return generateToken(res, newUser, "User created and logged in successfully");

    } catch (error) {
        console.log("error from user register ", error);
        return res.status(500).json({ success: false, message: "Failed to register" });
    }
};

const login = async (req,res)=>{

    // getting inputs from fronted
    try {
        let {email,password} = req.body
    
    // is any input empty
    if(!email || !password){
       return res.status(400).json({
            success:false,
            message:"All fields are required"
        })
    }
    // is not availbale 
    let user = await userModel.findOne({email})
    
    if(!user){
       return res.status(400).json({
            success:false,
            message:"invalid email or password"
        })
    }
    
    const verify = await bcryptjs.compare(password,user.password)
    if(!verify){
       return res.status(400).json({
            success:false,
            message:"invalid email or password"
        })}
    generateToken(res,user,`welcome back ${user.name}`)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            succes:false,
            message:"Failed to Login "
        })
    }
}

const logout = async(req,res)=>{
    try {
        
   return res.status(200).cookie("token","",{maxAge:0}).json({
         success:true,
         message:"Logout successfully"
   })
   
    } catch (error) {
         console.log(error)
        return res.status(500).json({
            succes:false,
            message:"Failed to logout"
        })
    }
}
const getUserProfile = async (req,res)=>{
try {
const userId = req.id
const user = await userModel.findById(userId).select("-password").populate("enrolledCourses")
if(!user){
    res.status(404).json({
        success:false,
        message:"profile not found "
    })
}
return res.status(200).json({
    success:true,
    user
})
} catch (error) {
console.log(error)
return res.status(500).json({
        success:false,
        message:"Failed to load user"
})
}
}
const upadteUserProfile =async (req,res)=>{
    try {
       const userId = req.id
       const {name} = req.body
       const profilePhoto = req.file
       console.log("req.body consoling",req.body)  
       // user ko database me dhundhne k liye 
       const user = await userModel.findById(userId)
       if(!user){
        return res.status(404).json({
            message:"User not Found ",
            success:false
        })
       }
      // extract the public id  of the old image the url is it exists 
    //    if(user.photoUrl){
    //     const publicId = user.photoUrl.split("/").pop().split(".")[0]
    //     console.log(publicId)
    //     await deleteMediaFromCloudinary(publicId)
    // }
    //     // upload new photo
    //     const cloudResponse = await uploadMedia(profilePhoto.path)

    //     const photoUrl = cloudResponse.secure_url

if (user.photoUrl) {
    // अगर URL में फोल्डर स्ट्रक्चर है तो यह सेफ तरीका है publicId निकालने का
    const urlParts = user.photoUrl.split('/');
    const filenameWithExtension = urlParts.pop(); // e.g., "raman.jpg"
    const filename = filenameWithExtension.split('.')[0]; // e.g., "raman"
    
    // अगर इमेज किसी फोल्डर में थी, तो फोल्डर का नाम भी शामिल करें
    const folderName = urlParts.slice(urlParts.indexOf('upload') + 2).join('/');
    const publicId = folderName ? `${folderName}/${filename}` : filename;

    console.log("Deleting Public ID 👉", publicId);
    
    // 🟢 FIX: यहाँ await लगाना सबसे जरूरी है!
    await deleteMediaFromCloudinary(publicId); 
}

// 2. नया फोटो अपलोड करें (सिर्फ तब जब नई फाइल आई हो)
let photoUrl = user.photoUrl; // Default पुरानी फोटो रहेगी
if (profilePhoto) {
    const cloudResponse = await uploadMedia(profilePhoto.path);
    photoUrl = cloudResponse.secure_url;
}

      const updateData = {name,photoUrl}
    //   const updatedUser=await user.findByIdAndUpdate(userId,updateData,{new:true}).select("-password")
    //  SAHI: userModel ka use karein
const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true }).select("-password")  
    return res.status(200).json({
        seccess:true,
        user:updatedUser,
        message:"Profile updated successfully"
      })
    } catch (error) {
        console.log("error from updateUserProfile", error)
        return res.status(500).json({
            status:false,
            message:"Failed to update Profile"
        })
}
}
const userControllers ={register,login,logout,getUserProfile,upadteUserProfile}
module.exports = userControllers
 
