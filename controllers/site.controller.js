const donormodel = require("../models/donor")
const citymodel = require("../models/city")
const bloodgroupmodel = require("../models/bloodgroup")
const usermodel = require("../models/user")
const { setUser } = require('../service/auth')
const bcrypt = require('bcryptjs')
const { default: mongoose } = require("mongoose")


const loginIndex = async (req, res) => {
    const cities = await citymodel.find()
    const bloodgroups = await bloodgroupmodel.find()
    const user = await usermodel.find()
    return res.render('site/loginIndex', { cities, bloodgroups, user })

}

const getsearch = async (req, res) => {
    const cities = await citymodel.find({})
    const bloodgroups = await bloodgroupmodel.find({})
    return res.render('site/index', { cities, bloodgroups })
}

const search = async (req, res) => {
    try {
        let { city, bloodgroup } = req.query;

        let cities = await citymodel.find()
        let bloodgroups = await bloodgroupmodel.find()
        let donors = await donormodel.aggregate([
            {
                $match: {
                    city: new mongoose.Types.ObjectId(city),
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
            { $unwind: '$bloodgroup' },
            {
                $project: {
                    name: 1,
                    bloodgroup: 1
                }
            }

        ])

        if (donors.length === 0) {
            return res.render('site/searchdonor', { cities, bloodgroups, donors: [], message: "No Record Found." })
        }
        return res.render('site/searchdonor', { cities, bloodgroups, donors, message: "" })
    } catch (err) {
        console.log(err);
    }
}

const searchdonor = async (req, res) => {
    try {
        let { city, bloodgroup } = req.query;

        let user = await usermodel.find()
        let cities = await citymodel.find()
        let bloodgroups = await bloodgroupmodel.find()
        let donors = await donormodel.aggregate([
            {
                $match: {
                    city: new mongoose.Types.ObjectId(city),
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
            { $unwind: '$bloodgroup' },
            {
                $project: {
                    name: 1,
                    bloodgroup: 1
                }
            }

        ])

        if (donors.length === 0) {
            return res.render('site/searchdonors', { cities, bloodgroups, donors: [], message: "No Record Found.", user })
        }
        return res.render('site/searchdonors', { cities, bloodgroups, donors, message: "", user })
    } catch (err) {
        console.log(err);
    }
}

const getSignUp = async (req, res) => {
    const cities = await citymodel.find({})
    const bloodgroups = await bloodgroupmodel.find({})
    return res.render('site/signup', { cities, bloodgroups })
}

const signup = async (req, res) => {
    try {
        // console.log(req.body)
        const { name, gender, phone, city, bloodgroup, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10))

        if (bloodgroup) {
            const newDonor = await donormodel.create({
                name,
                gender,
                phone,
                city,
                bloodgroup,
                email,
                password: hashedPassword,
            });
            return res.redirect('/index')
        } else {
            const newUser = await usermodel.create({
                name,
                gender,
                phone,
                city,
                email,
                password: hashedPassword,
            });
            return res.redirect('/index')
        }
    } catch (error) {
        console.log(' signup : ' + error.message);
    }
}

const getlogin = async (req, res) => {
    return res.render('site/userlogin')
}

const userlogin = async (req, res) => {
    try {
        const cities = await citymodel.find({})
        const bloodgroups = await bloodgroupmodel.find({})

        const { email, password } = req.body;
        if (!email || !password) {
            return res.render('site/userlogin', { cities, bloodgroups, error: 'Please provide username and password' });
        }

        let user = await usermodel.findOne({ email });

        if (!user) user = await donormodel.findOne({ email })
        if (!user) return res.render('site/userlogin');

        else {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.redirect('/userlogin')
            }
            req.session.user = user;
            return res.render('site/loginIndex', { cities, bloodgroups, user })
        }
    } catch (error) {
        console.error('userlogin :' + error);
    }
}

const logout = (req, res) => {
    return res.redirect('/index')
}

const profile = async (req, res) => {
    try {
        const city = await citymodel.find({})
        if (!req.session.user) { return res.redirect('/'); }
        const user = await usermodel.findById(req.session.user);
        const donor = await donormodel.findById(req.session.user);
        return res.render('site/profile', { city, user, user: req.session.user })
    } catch (err) {
        console.log(err);
    }
}

const editprofile = async (req, res) => {
    const cities = await citymodel.find({})
    const user = await usermodel.find()
    return res.render('site/updateprofile', { cities, user })
}

const updateprofile = async (req, res) => {
    try {
        if (!req.session.user) { return res.redirect('/'); }
        const { name, gender, phone, cityid } = req.body;
        const user = await usermodel.findByIdAndUpdate(req.session.user, { name, gender, phone, city: cityid }, { new: true })
        // console.log(usermodel)

        if (!user) return res.status(404).json({ error: 'profile not found' });

        return res.redirect('/profile')
    } catch (err) {
        res.status(400).json({ error: 'Failed to update post', details: err.message });
    }
}

const getdonorprofile = async (req, res) => {
    try {
        // console.log( req.query)
    const user = await usermodel.find()
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
            { $unwind: '$bloodgroup' },
            {
                $project: {
                    name: 1,
                    bloodgroup: 1,
                    phone: 1,
                    city: 1
                }
            }

        ])
    return res.render('site/donorprofile', { donors, user })
    } catch (err) {
        console.log(err);
    }

}

const getpasswordchange = async (req, res) => {
    try {
        const user = await usermodel.findOne()
        return res.render('site/passwordchange', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

const passwordchange = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await usermodel.findById();
        if (!user) {
            return res.render('site/passwordchange', { user, error: 'User not found', success: null });
        }

        // Compare old password with stored hash
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.render('site/passwordchange', { error: 'Old password is incorrect', success: null });
        }

        // Hash new password and update
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();

        return res.render('site/passwordchange', { error: null, success: 'Password updated successfully!' });
    } catch (error) {
        console.error(error);
        return res.render('site/passwordchange', { error: 'Something went wrong', success: null });
    }
}


module.exports = { loginIndex, getsearch, search, searchdonor, getSignUp, signup, getlogin, userlogin, logout, profile, editprofile, updateprofile, getdonorprofile, getpasswordchange, passwordchange }