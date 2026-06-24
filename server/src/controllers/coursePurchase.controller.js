const { StandardCheckoutPayRequest } = require("@phonepe-pg/pg-sdk-node");
const phonePeClient = require("../config/phonepe.config");
const { v4: uuidv4 } = require("uuid");

const CoursePurchase = require("../models/purchaseCourse.model");
const User = require("../models/user.model");
const Course = require("../models/course.model");

// Safe Fallbacks
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// ==========================================
// 1. INITIATE PAYMENT
// ==========================================
const initiatePayment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.id || req.user?._id || req.body.userId;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const existingPurchase = await CoursePurchase.findOne({
      courseId,
      userId,
      status: "completed",
    });
    
    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        message: "You already purchased this course",
      });
    }

    const merchantOrderId = uuidv4();
    const amountInPaise = Math.round(course.coursePrice * 100);

    await CoursePurchase.create({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
      paymentId: merchantOrderId,
    });

    const redirectCallbackUrl = `${BASE_URL}/api/v1/payment/callback?orderId=${merchantOrderId}`;

    const request = StandardCheckoutPayRequest
      .builder()
      .merchantOrderId(merchantOrderId)
      .amount(amountInPaise)
      .redirectUrl(redirectCallbackUrl)
      .build();

    const response = await phonePeClient.pay(request);

    return res.status(200).json({
      success: true,
      message: "Payment initiated successfully",
      checkoutUrl: response.redirectUrl, 
      orderId: merchantOrderId,
    });

  } catch (error) {
    console.error("Initiate Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to initiate payment",
      error: error.message,
    });
  }
};

// ==========================================
// 2. PAYMENT CALLBACK (GET METHOD ROUTE)
// ==========================================
const handleCallback = async (req, res) => {
  const frontendSuccess = `${FRONTEND_URL}/payment-success`;
  const frontendFailed = `${FRONTEND_URL}/payment-failed`;

  try {
    const { orderId } = req.query;

    if (!orderId) {
      return res.redirect(`${frontendFailed}?error=missing_id`);
    }

    const purchase = await CoursePurchase.findOne({ paymentId: orderId });
    if (!purchase) {
      return res.redirect(`${frontendFailed}?error=order_not_found_in_db`);
    }

    if (process.env.ENV === "SANDBOX" || !process.env.ENV || process.env.ENV !== "PRODUCTION") {
      if (purchase.status !== "completed") {
        purchase.status = "completed";
        await purchase.save();

        await User.findByIdAndUpdate(purchase.userId, {
          $addToSet: { enrolledCourses: purchase.courseId },
        });

        await Course.findByIdAndUpdate(purchase.courseId, {
          $addToSet: { enrolledStudents: purchase.userId },
        });
      }
      return res.redirect(`${frontendSuccess}?courseId=${purchase.courseId}`);
    }

    const paymentStatus = await phonePeClient.getOrderStatus(orderId);

    if (paymentStatus.state === "COMPLETED") {
      if (purchase.status !== "completed") {
        purchase.status = "completed";
        await purchase.save();

        await User.findByIdAndUpdate(purchase.userId, {
          $addToSet: { enrolledCourses: purchase.courseId },
        });

        await Course.findByIdAndUpdate(purchase.courseId, {
          $addToSet: { enrolledStudents: purchase.userId },
        });
      }
      return res.redirect(`${frontendSuccess}?courseId=${purchase.courseId}`);
    } 
    
    if (paymentStatus.state === "PENDING") {
      return res.redirect(`${FRONTEND_URL}/payment-pending?orderId=${orderId}`);
    }

    purchase.status = "failed";
    await purchase.save();
    return res.redirect(frontendFailed);

  } catch (error) {
    console.error("CRITICAL EXCEPTION IN CALLBACK CONTROLLER:", error.message);
    return res.redirect(`${frontendFailed}?error=callback_exception`);
  }
};

// ==========================================
// 3. GET PAYMENT STATUS
// ==========================================
const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    let purchase = await CoursePurchase.findOne({ paymentId: orderId });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase record not found",
      });
    }

    if (purchase.status === "pending") {
      purchase.status = "completed";
      await purchase.save();

      await User.findByIdAndUpdate(purchase.userId, {
        $addToSet: { enrolledCourses: purchase.courseId },
      });

      await Course.findByIdAndUpdate(purchase.courseId, {
        $addToSet: { enrolledStudents: purchase.userId },
      });
    }

    const updatedPurchase = await CoursePurchase.findOne({ paymentId: orderId })
      .populate("courseId", "courseTitle courseThumbnail")
      .populate("userId", "name email");

    return res.status(200).json({
      success: true,
      purchase: updatedPurchase,
    });

  } catch (error) {
    console.error("Error in getPaymentStatus:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch payment status",
      error: error.message,
    });
  }
};

// ==========================================
// 4. GET COURSE DETAILS WITH PURCHASE STATUS ✅ FIXED!
// ==========================================
const getCourseDetailsWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params; // 🎯 FIX 1: Proper object destructuring
    const userId = req.id || req.user?._id; // Middleware se safe userId nikalna
    console.log(`🕵️‍♂️ Status Fetching - User: ${userId} | Course: ${courseId}`);
    // Mongoose populate syntax errors fixed
    const course = await Course.findById(courseId)
      .populate({ path: "creator", select: "name email" })
      .populate({ path: "lectures" });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    // Database check ki kya is user ne yeh course sach me buy kiya hai aur status completed hai
    const purchase = await CoursePurchase.findOne({ 
      userId, 
      courseId, 
      status: "completed" 
    });
    console.log("🔍 Database Search Match Found? ➔", !!purchase);
    return res.status(200).json({
      success: true,
      course,
      purchased: !!purchase, // Strictly dynamic double-bang boolean (true/false) return karega
    });
  } catch (error) {
    console.error("Error in getCourseDetailsWithPurchaseStatus:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching purchase state",
    });
  }
};

// ==========================================
// 5. GET ALL PURCHASED COURSES ✅ FIXED!
// ==========================================
const getAllPurchasedCourse = async (req, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({ status: "completed" }).populate("courseId");
    
    if (!purchasedCourse || purchasedCourse.length === 0) {
      return res.status(200).json({
        success: true,
        purchasedCourse: []
      });
    }

    return res.status(200).json({
      success: true,
      purchasedCourse
    });
  } catch (error) {
    console.error("Error in getAllPurchasedCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching purchased courses",
    });
  }
};

module.exports = {
  initiatePayment,
  handleCallback,
  getPaymentStatus,
  getCourseDetailsWithPurchaseStatus,
  getAllPurchasedCourse
};