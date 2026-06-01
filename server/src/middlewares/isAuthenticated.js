const jwt = require("jsonwebtoken")

const isAuthenticated = async(req,res,next)=>{
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(400).json({
                message:"user not authenticated",
                success:false
            })
        }
       const decode = jwt.verify(token, process.env.JWT_SECRET);
       console.log("DECODE DATA 👉", decode); 
         
        if(!decode){
            return res.status(400).json({
                message:"Invalid token",
                success:false
            })
        }
        req.id = decode.userId
        next()
    } catch (error) {   
        console.log("Error from your authentication page",error)
        return res.status(400).json({
            success:false,
            message:"User not authenticated"
        })
    }
}
module.exports = isAuthenticated 

