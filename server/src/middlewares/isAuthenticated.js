

// const jwt = require("jsonwebtoken");

// const isAuthenticated = async (req, res, next) => {
//     try {
//         console.log("--- AUTH CHECK ---");
//         console.log("Cookies Received:", req.cookies);
        
//         const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
//         console.log("Token Found:", token ? "Yes" : "No");

//         if (!token) {
//             return res.status(401).json({
//                 message: "User not authenticated. Token missing!",
//                 success: false
//             });
//         }

//         const decode = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("DECODE DATA 👉", decode); 
         
//         if (!decode) {
//             return res.status(401).json({
//                 message: "Invalid token verification failed",
//                 success: false
//             });
//         }

//         // 👈 FIX: Agar token me userId hai toh wo lo, nahi toh _id ya id lo (Safe For Students)
//         req.id = decode.userId || decode._id || decode.id;
//         req.role = decode.role; // Role ko bhi request me save kar lete hain debug ke liye

//         if (!req.id) {
//             return res.status(400).json({
//                 message: "Authentication successful but User ID is missing in token payload!",
//                 success: false
//             });
//         }

//         next();
//     } catch (error) {   
//         console.log("Error from your authentication page:", error.message);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server authentication error",
//             error: error.message
//         });
//     }
// };

// module.exports = isAuthenticated;

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