var User = require('../models/userModel');
var jwt = require('jsonwebtoken');
const { main } = require('../nodemailer');
const { chefLogin } = require('../twilio');

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
    if(req.files?.profilephoto) {
        user.photo = {url: req.files.profilephoto[0].path, filename: req.files.profilephoto[0].filename, type: req.files.profilephoto[0].mimetype, size: req.files.profilephoto[0].size};
    }
    if(req.body?.role) {
        user.role = req.body.role;
        chefLogin('Thank you for becoming a chef on our platform. Please use the url to login and start your journey. https://food-meal-kit-admin.herokuapp.com/', user.phone);
    }
    user.save();
    res.json({success: true})
}