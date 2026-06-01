const express = require("express")
const userControllers = require("../controllers/user.controller")
const isAuthenticated = require("../middlewares/isAuthenticated")
const upload = require("../utils/multer")
const userRouter = express.Router()



userRouter.post("/register",userControllers.register)
userRouter.post("/login",userControllers.login)
userRouter.get("/profile",isAuthenticated, userControllers.getUserProfile)
userRouter.get("/logout",userControllers.logout)
// userRouter.put("/profile/update",isAuthenticated,upload.single("profilePhoto"),userControllers.upadteUserProfile)
// Backend example route
// userRouter.put('/profile/update', upload.single('profilePhoto'), userControllers.upadteUserProfile);
// 🟢 FIX: isAuthenticated lagana zaroori hai taaki req.id mil sake
userRouter.put('/profile/update', isAuthenticated, upload.single('profilePhoto'), userControllers.upadteUserProfile);
module.exports = userRouter



