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

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated. Token missing!"
            });
        }

        // Token verify karein
        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        // 🌟 FIX: Kyunki generateToken me humne 'userId' store kiya tha, yahan bhi 'userId' hi nikalenge
        req.id = decode.userId; 
        next();
    } catch (error) {
        console.log("Error in isAuthenticated middleware:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = isAuthenticated;