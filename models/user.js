const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name:String,
  gender:String,
  phone:Number,
  city:{type:mongoose.Schema.Types.ObjectId,ref:"City"},
  email:String,
  password:String
});

module.exports = mongoose.model('User', userSchema);

