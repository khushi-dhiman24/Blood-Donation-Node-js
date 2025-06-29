const express = require('express')
const router = express.Router()
const {adminLogin,logout,getchangepassword,updatepassword} = require("../controllers/admin.controller")
const {alldonors,createdonor,adddonor,editdonor,updatedonor,deletedonor}= require("../controllers/donor.controller")
const {allbloodgroup,creategrp,addgroup,editgroup,updategroup,deletegroup}=require("../controllers/bloodgrp.controller")
const {allcities,createcity,addcity,editcity,updatecity,deletecity} = require("../controllers/city.controller")
const {setting,createsetting,updatesetting} = require("../controllers/setting.controller")
const {bloodgroupreport,searchreport} = require("../controllers/bloodgroupreport.controller")
const {allUser,deleteuser} = require("../controllers/user.controller")
const {countdashboard} = require("../controllers/dashboard.controller")
const checkLogin = require('../middleware/checkLogin')


// DASHBOARD routes
router.get('/dashboard',countdashboard)

// LOGIN routes
router.get('/login',(req, res) => {res.render('admin/login')})
router.post('/login',adminLogin)
router.get('/logout',logout)
router.get('/changepassword',getchangepassword)
router.post('/changepassword',updatepassword)

// DONOR routes
router.get('/donor',alldonors)
router.get('/adddonor',adddonor)
router.post('/donor',createdonor)
router.get('/updatedonor/:id',editdonor)
router.post('/donor/:id',updatedonor)
router.get('/deletedonor/:id',deletedonor)

// CATEGORY routes
router.get('/bloodgroup',allbloodgroup)
router.get('/addgroup',addgroup)
router.post('/bloodgroup',creategrp)
router.get('/updategroup/:id',editgroup)
router.post('/bloodgroup/:id',updategroup)
router.get('/deletegroup/:id', deletegroup)

// CITY routes
router.get('/city',allcities)
router.get('/addcity',addcity)
router.post('/city',createcity)
router.get('/updatecity/:id',editcity)
router.post('/city/:id',updatecity)
router.get('/deletecity/:id',deletecity)

// BLOODGROUP REPORT routes
router.get('/bloodgrpreport',bloodgroupreport)
router.get('/bloodgroupreport',searchreport)

// SETTING routes
router.get('/setting',setting)
router.post('/setting',createsetting)
router.post('/setting/:id',updatesetting)

// USER routes
router.get('/user',allUser)
router.get('/deleteuser/:id',deleteuser)


module.exports = router