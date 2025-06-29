const mongoose = require('mongoose');

const settingSchema = mongoose.Schema({
  sitename:String,
  logo:String,
  username:String,
  adminname:String
});

module.exports = mongoose.model('Setting', settingSchema);

