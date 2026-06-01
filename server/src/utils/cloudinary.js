require("dotenv/config")
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET_KEY // 👈 Yahan _KEY jod diya
})

const uploadMedia = async (file) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(file, {
            resource_type: "auto"
        })
        return uploadResponse 
    } catch (error) {
        console.log(error)
    }
}

// const deleteMediaFromCloudinary = async (publicId) => {
//     try {
//         await cloudinary.uploader.destroy(publicId)
//     } catch (error) {
//         console.log("Error from image of cloudinary", error)
//     }
// }

const deleteMediaFromCloudinary = async (publicId) => {
    try {
        const res = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary Delete Response: ", res); 
        return res;
    } catch (error) {
        console.log("Error from image of cloudinary", error);
    }
};

const deleteVideoFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: "video" })
    } catch (error) {
        console.log("Error from video of cloudinary", error)
    }
}

module.exports = {
    uploadMedia,
    deleteMediaFromCloudinary,
    deleteVideoFromCloudinary
}