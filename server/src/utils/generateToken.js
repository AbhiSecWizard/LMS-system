const jwt = require("jsonwebtoken");

const generateToken = async (res, user, message) => {
  const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
 res.cookie("token", token, {
    httpOnly: true,
    secure: true,        // Production me true hona chahiye (https ke liye)
    sameSite: "none",    // Cross-origin requests ke liye 'none' hona zaroori hai
    maxAge: 24 * 60 * 60 * 1000 // 1 day
}).status(200).json({
    success:true,
    message:message 
})
}

module.exports = generateToken
