const usermodel = require("../models/user")

const allUser = async (req, res) => {
  try {
    const users = await usermodel.aggregate([
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
      }
    ])
    res.render('admin/user', { users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}

const deleteuser = async (req, res) => {
  let { name, gender, phone, city, bloodgroup, email, password } = req.body;
  let data = await usermodel.findByIdAndDelete(req.params.id, { name, gender, phone, city, bloodgroup, email, password })
  res.redirect('/user')
}

module.exports = { allUser, deleteuser }