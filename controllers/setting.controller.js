const settingmodel = require("../models/setting")

const setting = async (req, res) => {
    try {
        const setting = await settingmodel.findOne();
        res.render('admin/setting', { setting });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

const createsetting = async (req, res) => {
    try {
        let { sitename, logo, username, adminname } = req.body
        let data = await settingmodel.create({ sitename, logo, username, adminname })

        res.redirect('/setting')
        // console.log(req.body)
    } catch (err) {
        return res.send(err.message)
    }
};

const updatesetting = async (req, res) => {
    try {
        const { sitename, logo, username, adminname } = req.body;

        const updatedsetting = await settingmodel.findOneAndUpdate(
            { sitename, logo, username, adminname }, { new: true, upsert: true }
        );

        res.render('admin/setting', { success: updatedsetting });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Data not updated' });
    }
};

module.exports = { setting, createsetting, updatesetting }