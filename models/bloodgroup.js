const mongoose = require('mongoose');

const bloodgroupSchema = mongoose.Schema({
  name:String
});

module.exports = mongoose.model('Bloodgroup', bloodgroupSchema);

