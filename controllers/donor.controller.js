const donormodel = require("../models/donor")
const citymodel = require("../models/city")
const bloodgroupmodel = require("../models/bloodgroup")


const alldonors = async (req, res) => {
  try {
    const totaldonors = await donormodel.countDocuments();
    let donors = await donormodel.aggregate([
      {
        $lookup: {
          from: 'bloodgroups',
          localField: 'bloodgroup',
          foreignField: '_id',
          as: 'bloodgroup'
        }
      },
      {
        $unwind: {
          path: '$bloodgroup',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'cities',
          localField: 'city',
          foreignField: '_id',
          as: 'city'
        }
      },
      {
        $unwind: {
          path: '$city',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          formattedDate: {
            $dateToString: {
              format: '%d-%m-%Y',
              date: '$date'
            }
          }
        }
      },
      {
        $project: {
          name: 1,
          gender: 1,
          email: 1,
          phone: 1,
          address: 1,
          pincode: 1,
          city: 1,
          state: 1,
          country: 1,
          bloodgroup: 1
        }
      }
    ])
    // console.log(posts)
    res.render('admin/donor', { donors, totaldonors })
  } catch (err) {
    console.log('error :' + err.message);
  }
}

const createdonor = async (req, res) => {
  try {
    const { name, gender, email, phone, address, pincode, cityid, state, country, bloodgroupId } = req.body;
    const data = await donormodel.create({ name, gender, email, phone, address, pincode, city: cityid, state, country, bloodgroup: bloodgroupId })
    if (!data) {
      return res.status(404).redirect('/adddonor')
    }
    return res.redirect('/donor')
  } catch (error) {
    res.status(400).send({ error: 'Failed to create post', details: error.message });
  }
}

const adddonor = async (req, res) => {
  try {
    const bloodgroups = await bloodgroupmodel.find();
    const cities = await citymodel.find();
    return res.render('admin/adddonor', { bloodgroups, cities });
  } catch (error) {
    return res.status(500).send(error);
  }
}

const editdonor = async (req, res) => {
  let bloodgroups = await bloodgroupmodel.find({})
  let cities = await citymodel.find({})
  let donor = await donormodel.findById({ _id: req.params.id })

  return res.render('admin/updatedonor', { donor, bloodgroups, cities })
}

const updatedonor = async (req, res) => {
  try {
    const { name, gender, email, phone, address, pincode, cityid, state, country, bloodgroupId } = req.body;
    const updatedonor = await donormodel.findByIdAndUpdate({ _id: req.params.id },
      { name, gender, email, phone, address, pincode, city: cityid, state, country, bloodgroup: bloodgroupId }, { new: true })

    if (!updatedonor) return res.status(404).json({ error: 'donor not found' });

    res.redirect('/donor')
  } catch (err) {
    res.status(400).json({ error: 'Failed to update post', details: err.message });
  }
}

const deletedonor = async (req, res) => {
  let { name, gender, email, phone, address, pincode, city, state, country, bloodgroup } = req.body;
  let data = await donormodel.findByIdAndDelete(req.params.id, { name, gender, email, phone, address, pincode, city, state, country, bloodgroup })
  if (!data) {
    res.send('donor not found')
  } else {
    res.redirect('/donor')
  }
}


module.exports = { alldonors, createdonor, adddonor, editdonor, updatedonor, deletedonor }