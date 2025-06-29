const express = require('express');
const session = require('express-session');
const app = express()
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser')
const bodyparser = require('body-parser')
const adminRoutes = require("./routes/admin.routes")
const siteRoutes = require("./routes/site.routes")


app.use(session({
  secret: 'your_secret_key',  
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  
}))

app.use(bodyparser.urlencoded({ extended: true }))
app.use(cookie())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'))
app.use('/images', express.static('images'))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use('/', adminRoutes)
app.use('/', siteRoutes)


mongoose.connect('mongodb://127.0.0.1:27017/blood-donation')
  .then(() => console.log('Connected! to MongoDB'));
app.listen(3000, () => {
  try {
    console.log('Server is running on port 3000')
  } catch (error) {
    console.log('Server crash')
  }
});