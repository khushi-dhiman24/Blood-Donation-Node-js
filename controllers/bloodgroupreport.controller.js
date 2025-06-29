const donormodel = require("../models/donor")
const citymodel = require("../models/city")
const bloodgroupmodel = require("../models/bloodgroup")
const { default: mongoose, Mongoose } = require("mongoose")

const bloodgroupreport = async (req, res) => {
    try {
      const bloodgroups = await bloodgroupmodel.find({});
      const donors = await donormodel.aggregate([
        {
            $lookup: {
                from: 'cities',
                localField: 'city',
                foreignField: '_id',
                as: 'city'
            }
        },
        { $unwind: '$city' },
        {
            $lookup: {
                from: 'bloodgroups',
                localField: 'bloodgroup',
                foreignField: '_id',
                as: 'bloodgroup'
            }
        },
        { $unwind: '$bloodgroup' }
      ])     
      
      return res.render('admin/bloodgroupreport', { donors, bloodgroups });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
}
const searchreport = async (req,res) => {
    try {
        let {bloodgroup}  = req.query;
        let bloodgroups = await bloodgroupmodel.find()

        let donors = await donormodel.aggregate([
            {
                $match: {
                    bloodgroup: new mongoose.Types.ObjectId(bloodgroup),
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
            { $unwind: '$city' },
            {
                $lookup: {
                    from: 'bloodgroups',
                    localField: 'bloodgroup',
                    foreignField: '_id',
                    as: 'bloodgroup'
                }
            },
            { $unwind: '$bloodgroup' }

        ])

        if (donors.length === 0) {
            return res.render('admin/bloodgroupreport',{donors,bloodgroups} )
        }
        return res.render('admin/bloodgroupreport',{donors,bloodgroups})
    } catch (err) {
        console.log(err);
    }
}


module.exports= { bloodgroupreport, searchreport }