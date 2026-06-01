require("dotenv/config")
const app = require("./src/app")
const port = process.env.PORT || 4000

app.listen(port,()=>{
    console.log(`your web server is running on http://localhost:${[port]}`)
})
