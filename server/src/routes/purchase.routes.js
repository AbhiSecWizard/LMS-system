// routes/paymentRoutes.js
const express =require( 'express');
const {
  initiatePayment,
  handleCallback,
  getPaymentStatus,
  getCourseDetailsWithPurchaseStatus,
  getAllPurchasedCourse
} =require('../controllers/coursePurchase.controller.js');
const isAuthenticated =require('../middlewares/isAuthenticated');

const paymentRouter = express.Router();

paymentRouter.post('/initiate', isAuthenticated,
 initiatePayment)
paymentRouter.get('/callback', handleCallback);           // PhonePe callback (no auth)
paymentRouter.get('/status/:orderId', isAuthenticated, getPaymentStatus);
paymentRouter.get('/course/:courseId/detail-with-status',isAuthenticated, getCourseDetailsWithPurchaseStatus);
paymentRouter.get('/',getAllPurchasedCourse)
module.exports = paymentRouter  