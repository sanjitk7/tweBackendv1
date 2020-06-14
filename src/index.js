require("./db/mongo")


const express = require("express")
// const expressLayouts = require('express-ejs-layouts');
const cookieParser = require("cookie-parser")
const session = require("express-session")
const path = require("path")
const hbs = require("hbs")

const userRouter = require("./routes/users")
const articleRouter = require("./routes/articles")
const indexRouter = require("./routes/index")
const resetRouter = require("./routes/reset")

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())



const viewsPath = path.join(__dirname,"./templates/views")
const partialsPath = path.join(__dirname,"./templates/partials")

// Set View Engine
app.set("view engine", "hbs");
app.set("views",viewsPath)
hbs.registerPartials(partialsPath)

// Static assests are served from public directory - css, js etc
app.use(express.static("public"))


// Cookies
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


// Set Routers
app.use("/",indexRouter)
app.use("/users",userRouter)
app.use("/articles",articleRouter)
app.use("/reset",resetRouter)

app.listen(port,()=>{
    console.log("Server Up on port"+port)
})