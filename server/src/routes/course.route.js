const express = require("express")
const courseControllers = require("../controllers/course.controller")
const isAuthenticated = require("../middlewares/isAuthenticated")
const upload = require("../utils/multer")
const courseRouter = express.Router()

courseRouter.post("/",isAuthenticated,courseControllers.createCourse)
courseRouter.get("/",isAuthenticated,courseControllers.getCreatorCourses)
courseRouter.put("/:courseId",isAuthenticated,upload.single("courseThumbnail"),courseControllers.editCourse)
courseRouter.get("/:courseId",isAuthenticated,upload.single("courseThumbnail"),courseControllers.getCourseId)

module.exports = courseRouter






