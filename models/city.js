const mongoose = require('mongoose');

const citySchema = mongoose.Schema({
  name:String
});

module.exports = mongoose.model('City', citySchema);

