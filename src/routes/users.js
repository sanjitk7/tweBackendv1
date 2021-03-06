const express = require("express")
const User = require("../models/users")
const {auth, adminAuth} = require("../middleware/auth")
const path = require("path")

const router = express.Router()

router.get("/signup", (req,res)=> {
    res.render("signup", {
        title: "Register"
    })
})

router.get("/login", (req,res)=> {
    res.render("login", {
        title: "Login"
    })
})

// Create Account
router.post("/signup", async (req,res) => {

    const newUser = new User(req.body)
    try{
        console.log(req.body)
        console.log("Register Route")
        await newUser.save()
        const token = await newUser.generateToken()

        // store the jwt after validatoin in a browser cookie
        res.cookie('auth_token', token);
        req.flash(
            'success_msg',
            'You are now registered and can log in'
          );
        // res.status(201).send({newUser})
        // redirect to dashboard
        res.redirect("/users/dashboard")
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

// Login
router.post("/login", async (req,res) => {
    try{
        const userFound = await User.findByCredentials(req.body.email, req.body.password)
        // console.log(userFound)
        const token = await userFound.generateToken()
        // console.log("token")

        // store the jwt after validatoin in a browser cookie
        // res.cookie('auth_token', token)
        // res.sendFile(path.resolve(__dirname,"..", 'templates/views', 'private-dashboard.hbs'))
        res.redirect("/users/dashboard")

        // res.send({userFound,token})

    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

// Logout User
router.get("/logout", auth, async (req,res)=>{
    try {
        console.log(req.user)
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token!==req.token
        })
        await req.user.save();
        
        res.redirect('/users/login');
    } catch (e) {
        res.status(500).send()
    }
})

// Logout User from all devices
router.post("/logoutAll", auth, async (req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
        
    } catch (e){
        res.status(500).send()
    }
})

// Private User Dashboard

router.get("/dashboard",auth, (req,res)=> {
    var resMessage = "Test Message"
    res.render("private-dashboard", {
        title: "Dashboard", 
        message: resMessage
    });
})

// Update User Data
router.patch("/me",auth, async (req,res) => {
    const updateFieldsReq = Object.keys(req.body)


    const validFields = ["name", "email", "age","password"]
    const isValidateFields = updateFieldsReq.every((field) => validFields.includes(field)) // automaticly returns based on ES6
    
    if (!isValidateFields){
        return res.status(400).send({ "error" : "Invalid Update Requested!"})
    }
    try {
        updateFieldsReq.forEach((updateField) => req.user[updateField] = req.body[updateField])
        await req.user.save()
        // const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new:true, runValidators: true })
        res.send(req.user)
    } catch (e) {
        send.status(400).send(e)
    }
})

router.delete("/me", auth, async (req,res) => {
    try {
        await req.user.remove()
        res.send()
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

module.exports = router