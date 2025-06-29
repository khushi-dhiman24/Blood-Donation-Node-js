const citymodel = require("../models/city")

const allcities = async (req, res) => {
  try {
    const totalcities = await citymodel.countDocuments();
    let cities = await citymodel.aggregate([
      {
        $lookup: {
          from: 'donors',
          localField: '_id',
          foreignField: 'city',
          as: 'donors'
        }
      },
      {
        $addFields: {
          postLength: {
            $size: '$donors'
          }
        }
      },

    ])
    res.render('admin/city', { totalcities, cities })
  }
  catch (error) {
    console.log('error :' + error.message);
  }
}

const createcity = async (req, res) => {
  try {
    let { name } = req.body
    let data = await citymodel.create({ name })

    res.redirect('/city')
    // console.log(req.body)
  } catch (err) {
    return res.send(err.message)
  }
}

const addcity = (req, res) => {
  return res.render('admin/addcity')
}

const editcity = async (req, res) => {
  let city = await citymodel.findById(req.params.id)
  if (!city) {
    return res.status(404).send("City not found");
  }
  res.render('admin/updatecity', { city })
}

const updatecity = async (req, res) => {
  let { name } = req.body;
  let city = await citymodel.findByIdAndUpdate(req.params.id, { name }, { new: true })
  res.redirect({ city }, '/city')
}

const deletecity = async (req, res) => {
  let { name } = req.body;
  let data = await citymodel.findByIdAndDelete(req.params.id, { name })
  if (!data) {
    res.send('city not found')
  } else {
    res.redirect('/city')
  }
}

module.exports = { allcities, createcity, addcity, editcity, updatecity, deletecity }