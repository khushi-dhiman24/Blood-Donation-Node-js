const mongoose = require('mongoose');

const donorSchema = mongoose.Schema({
  name:String,
  gender:{
    type:String,
    enum:["Male","Female"]},
  email:String,
  phone:Number,
  address:String,
  pincode:Number,
  city:{type:mongoose.Schema.Types.ObjectId,ref:"City"},
  state:String,
  country:String,
  bloodgroup:{type:mongoose.Schema.Types.ObjectId,ref:"bloodgroup"},
  password:String
});

module.exports = mongoose.model('Donor', donorSchema);

