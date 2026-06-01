const express = require("express");
const connectDB = require("./db/db");
const userRouter = require("./routes/user.route");
const cookieParser = require("cookie-parser")
const cors = require("cors");
const courseRouter  = require("./routes/course.route");
const app = express()// machine created 

// default middlewares
app.use(express.json()) // plain data convert in json format 
app.use(cookieParser()) // for object wat

app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
})) // cross origin problem solve 



connectDB() // database calling for saw that connected or not 




app.use("/api/v1/user",userRouter)
app.use("/api/v1/course",courseRouter)

app.get("/home",(req,res)=>{
res.status(200).json({
  success:true,
  message:'Hello i am coming from backend'
})
})


app.get("/checkapi",(req,res)=>{
  res.send("your server is healthy")
})



module.exports = app

