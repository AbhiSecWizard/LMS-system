require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./db/db");
const userRouter = require("./routes/user.route");
const courseRouter = require("./routes/course.route");
const mediaRouter = require("./routes/media.route");
const paymentRouter = require("./routes/purchase.routes");
const courseProgressRouter = require("./routes/courseProgress.route");

const app = express(); // Express app instance created

// 1. GLOBAL MIDDLEWARES
app.use(express.json()); // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data (Form data ke liye helpful hai)
app.use(cookieParser()); // Parses cookies attached to the client request

// 2. CORS CONFIGURATION (Enhanced for Production)
app.use(cors({
    origin: [
        "http://localhost:5173", 
        "https://lms-system-frontend-8k9n.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}));
// 3. DATABASE CONNECTION
connectDB(); // Connects to MongoDB Atlas / Local

// 4. API ROUTE MAPPINGS
app.use("/api/v1/user", userRouter);
app.use("/api/v1/media", mediaRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/progress", courseProgressRouter); // Perfectly mapped with the frontend RTK Query BaseURL!

// 5. HEALTH CHECK & BASE ROUTES
app.get("/home", (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hello, I am coming from the backend!'
  });
});

app.get("/checkapi", (req, res) => {
  res.status(200).send("Your server is healthy 🚀"); // Standardized with status code
});

// 6. SERVER STARTUP (Uncomment if you don't have a separate server.js file)
/*
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running smoothly on port ${PORT}`);
});
*/

module.exports = app;