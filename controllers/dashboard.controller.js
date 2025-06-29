const donormodel = require("../models/donor")
const citymodel = require("../models/city")
const bloodgroupmodel = require("../models/bloodgroup")
const usermodel = require("../models/user")

const countdashboard = async (req, res) => {
    try {
        const totalusers = await usermodel.countDocuments();
        const totaldonors = await donormodel.countDocuments();
        const totalbloodgroups = await bloodgroupmodel.countDocuments();
        const totalcities = await citymodel.countDocuments();
    
        return res.render('admin/dashboard', { totalusers, totaldonors, totalbloodgroups, totalcities });
      } catch (err) {
        console.error(err);
        return res.status(500).send('Server Error');
      }
}

module.exports = {countdashboard}
  