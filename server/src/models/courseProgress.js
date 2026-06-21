const mongoose = require("mongoose");

const lectureProgressSchema = new mongoose.Schema({
  lectureId: { type: String, required: true }, // 🟢 Fixed Typo: lecturedId -> lectureId
  viewed: { type: Boolean, default: false }
});

const courseProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { type: String, required: true },
  completed: { type: Boolean, default: false }, // 🟢 Changed from String to Boolean
  lectureProgress: [lectureProgressSchema] // 🟢 Correct array wrapper syntax
});

const courseProgress = mongoose.model('courseProgress', courseProgressSchema);

module.exports = courseProgress;