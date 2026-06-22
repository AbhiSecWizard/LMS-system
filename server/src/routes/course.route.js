const express = require("express");
const courseControllers = require("../controllers/course.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");
const upload = require("../utils/multer");
const courseRouter = express.Router();
courseRouter.get("/search", isAuthenticated  , courseControllers.searchCourse);
courseRouter.post("/", isAuthenticated, courseControllers.createCourse);
courseRouter.get("/published-course", courseControllers.getPublishedCourse);
courseRouter.get("/",isAuthenticated, courseControllers.getCreatorCourses);
courseRouter.put("/:courseId", isAuthenticated, upload.single("courseThumbnail"), courseControllers.editCourse);
courseRouter.get("/:courseId", isAuthenticated, upload.single("courseThumbnail"), courseControllers.getCourseId);
courseRouter.delete("/:courseId", isAuthenticated, courseControllers.removeCourse);
// Lectures Routesdeta
courseRouter.post("/:courseId/lecture", isAuthenticated, courseControllers.createLecture);
courseRouter.get("/:courseId/lecture", isAuthenticated, courseControllers.getCourseLecture);
// 🟢 FIX: Changed POST to PUT & Corrected spelling from ':lecureId' to ':lectureId'
courseRouter.put("/:courseId/lecture/:lectureId", isAuthenticated, courseControllers.editLecture);
courseRouter.delete("/lecture/:lectureId",isAuthenticated, courseControllers.removeLecture);
courseRouter.get("/lecture/:lectureId",isAuthenticated, courseControllers.getLectureById);
courseRouter.patch("/:courseId/publish", isAuthenticated, courseControllers.togglePublishCourse);

module.exports = courseRouter;