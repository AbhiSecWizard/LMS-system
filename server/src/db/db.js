const mongoose  = require("mongoose")

async function connectDB (){
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/lms_db`)
    console.log("your db is connected")
  } catch (error) { 
    console.log("error from db",error)
  }
}
module.exports = connectDB