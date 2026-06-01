const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["instructor","student"],
        default:"student"
    },
    enrolledCourses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"course"
    }],
    photoUrl:{
        type:String,
        default:""
    }
},
{timestamps:true}
)
const userModel = mongoose.model("user",userSchema)

module.exports = userModel