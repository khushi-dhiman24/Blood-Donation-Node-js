const adminmodel = require("../models/admin")
const { setUser } = require('../service/auth')
const bcrypt = require('bcryptjs')

// login controller
const adminLogin = async (req, res) => {
  try {
    // console.log(req.body); 
    const { username, password } = req.body;
    if (!username || !password) {
      return res.render('admin/login', { error: 'Please provide username and password' });
    }
    const user = await adminmodel.findOne({ username });
    if (!user) {
      return res.render('admin/login', { error: 'User not found!' });
      //   console.log(user)
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.render('admin/dashboard', { error: 'Invalid credentials!' });
      //   console.log(isPasswordValid)
    }
    const token = setUser({ username: user.username });
    res.cookie('token', token);
    return res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('adminLogin :' + error);
    return res.render('admin/dashboard', { error: 'An error occurred. Please try again.' });
  }
}

const logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login')
}

const getchangepassword = async (req, res) => {
  try {
    const admin = await adminmodel.find({})
    res.render('admin/changepassword', { admin });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

const updatepassword = async (req, res) => {
  try {
    const { oldpassword, newpassword} = req.body;

    const admin = await adminmodel.findOne(); 
    if (!admin) {
        return res.render('admin/chnagepassword', { error: 'password not correct!' });
    }

    const isMatch = await bcrypt.compare(oldpassword, admin.password);
    if (!isMatch) {
        return res.render('admin/changepassword', { error: 'Invalid credentials!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(newpassword, salt);

    admin.password = hashedpassword;
    await admin.save();

    return res.redirect('/admin/dashboard');
} catch (error) {
    console.error(error);
    return res.render('admin/changepassword',{ error: 'An error occurred. Please try again.' });
}
}


module.exports = { adminLogin, logout, getchangepassword, updatepassword }
