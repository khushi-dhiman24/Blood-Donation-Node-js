const express = require('express')
const router = express.Router()
const {loginIndex,getsearch,search,searchdonor,getSignUp,signup,getlogin,userlogin,logout,profile,
editprofile,updateprofile,getdonorprofile,getpasswordchange,passwordchange}= require("../controllers/site.controller")

// SITE routes
router.get('/loginIndex',loginIndex)
router.get('/index',getsearch)
router.get('/searchdonor',search)
router.get('/searchdonors',searchdonor)

// SIGNUP routes
router.get('/signup',getSignUp)
router.post('/signup',signup)

// USERLOGIN routes
router.get('/userlogin',getlogin)
router.post('/index',userlogin)
router.get('/logout',logout)

// PROFILE routes
router.get('/donorprofile',getdonorprofile)

// USER PROFILE routes
router.get('/profile',profile)
router.get('/updateprofile',editprofile)
router.post('/profile/:id',updateprofile)

// PASSWORD CHANGE routes
router.get('/passwordchange',getpasswordchange)
router.post('/passwordchange',passwordchange)

module.exports = router

