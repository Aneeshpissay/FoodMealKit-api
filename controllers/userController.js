var User = require('../models/userModel');
var jwt = require('jsonwebtoken');
var { cloudinary } = require('../cloudinary');
exports.login = (req, res) => {
    const user = new User(req.body);
    user.save();
    res.json({success: true});
}

exports.getProfile = async (req, res) => {
    try {
        const usertoken = req.headers['authorization'];
        const token = usertoken.split(' ');
        const decoded = jwt.verify(token[1], 'RESTFULAPIs');
        const id = decoded._id;
        const user = await User.findById(id);
        res.json({user: user, success: true});
    } catch (error) {
        res.json({success: false});
    }
}

exports.editProfile = async (req, res) => {
    const usertoken = req.headers.authorization;
    const token = usertoken.split(' ');
    const decoded = jwt.verify(token[1], 'RESTFULAPIs');
    const id = decoded._id;
    const user = await User.findById(id);
    if(req.body.address) {
        user.address.push(req.body.address);
    }
    if(req.body.username) {
        user.username = req.body.username;
    }
    if(req.file) {
        if(user.photo) {
            cloudinary.uploader.destroy(user.photo.filename.split('/')[1], (err, res) => {
                user.photo = {uri: req.file.path, filename: req.file.filename, type: req.file.mimetype, size: req.file.size};
            });
        }
        else {
            user.photo = {uri: req.file.path, filename: req.file.filename, type: req.file.mimetype, size: req.file.size};
        }
    }
    if(req.body?.role) {
        user.role = req.body.role;
    }
    user.save();
    res.json({success: true})
}