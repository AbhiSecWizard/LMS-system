// const jwt = require("jsonwebtoken");

// const generateToken = async (res, user, message) => {
//   const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//     expiresIn: "1d",
//   });
//  res.cookie("token", token, {
//     httpOnly: true,
//     secure: true,        // Production me true hona chahiye (https ke liye)
//     sameSite: "none",    // Cross-origin requests ke liye 'none' hona zaroori hai
//     maxAge: 24 * 60 * 60 * 1000 // 1 day
// }).status(200).json({
//     success:true,
//     message:message 
// })
// }
// module.exports = generateToken

const jwt = require("jsonwebtoken");

const generateToken = async (res, user, message) => {
  // Payload me 'userId' hi rakhein
  const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return res.cookie("token", token, {
    httpOnly: true,
    secure: true,        // HTTPS (Render) ke liye sahi hai
    sameSite: "none",    // Cross-origin localhost ke liye sahi hai
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }).status(200).json({
    success: true,
    message: message,
    user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
        role: user.role
    }
  });
};

module.exports = generateToken;