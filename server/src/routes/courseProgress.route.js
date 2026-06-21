const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const courseProgressController = require("../controllers/courseProgress.controller");

const courseProgressRouter = express.Router();

// 1. GET COURSE PROGRESS (Added /:courseId)
courseProgressRouter.get(
  "/:courseId", 
  isAuthenticated, 
  courseProgressController.getCourseProgress
);

// 2. UPDATE LECTURE PROGRESS (Fixed 'lectures' plural mismatch)
courseProgressRouter.post(
  "/:courseId/lectures/:lectureId", 
  isAuthenticated, 
  courseProgressController.updateLecturesProgress
);

// 3. MARK COURSE AS COMPLETED (Fixed correct controller function mapping)
courseProgressRouter.post(
  "/:courseId/complete", 
  isAuthenticated, 
  courseProgressController.markAsCompleted
);

// 4. MARK COURSE AS INCOMPLETE (Added missing route)
courseProgressRouter.post(
  "/:courseId/incomplete", 
  isAuthenticated, 
  courseProgressController.maskAsInCompleted
);

module.exports = courseProgressRouter;