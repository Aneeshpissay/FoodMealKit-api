var User = require('../models/userModel');

exports.login = (req, res) => {
    const user = new User(req.body);
    user.save();
    res.json({success: true});
}

exports.editProfile = async (req, res) => {
    const user = await User.findById(req.params.userid);
    if(req.body.username) {
        user.username = req.body.username;
    }
    if(req.files.profilephoto) {
        user.photo = {url: req.files.profilephoto[0].path, filename: req.files.profilephoto[0].filename, type: req.files.profilephoto[0].mimetype, size: req.files.profilephoto[0].size};
    }
    user.save();
    res.json({success: true})
}