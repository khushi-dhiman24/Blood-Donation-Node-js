const bloodgroupmodel = require("../models/bloodgroup")

const allbloodgroup = async (req, res) => {
  try {
    const totalbloodgroups = await bloodgroupmodel.countDocuments();
    let bloodgroups = await bloodgroupmodel.aggregate([
      {
        $lookup: {
          from: 'donors',
          localField: '_id',
          foreignField: 'bloodgroup',
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
    res.render('admin/bloodgroup', { totalbloodgroups, bloodgroups })
  }
  catch (error) {
    console.log('error :' + error.message);
  }
}

const creategrp = async (req, res) => {
  try {
    let { name } = req.body
    let data = await bloodgroupmodel.create({ name })

    res.redirect('/bloodgroup')
    // console.log(req.body)
  } catch (err) {
    return res.send(err.message)
  }
}

const addgroup = (req, res) => {
  res.render('admin/addgroup')
}

const editgroup = async (req, res) => {
  let bloodgroup = await bloodgroupmodel.findById(req.params.id)
  if (!bloodgroup) {
    return res.status(404).send("bloodgroup not found");
  }
  res.render('admin/updategroup', { bloodgroup })
}

const updategroup = async (req, res) => {
  let { name } = req.body;
  let bloodgroup = await bloodgroupmodel.findByIdAndUpdate(req.params.id, { name }, { new: true })
  res.redirect({ bloodgroup }, '/bloodgroup')
}

const deletegroup = async (req, res) => {
  let { name } = req.body;
  let data = await bloodgroupmodel.findByIdAndDelete(req.params.id, { name })
  res.redirect('/bloodgroup')
}

module.exports = { allbloodgroup, creategrp, addgroup, editgroup, updategroup, deletegroup }