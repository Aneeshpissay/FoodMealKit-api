var userHandlers = require('../controllers/userController');
const { userSignin, userLogin } = require('../twilio');
const { storage } = require('../cloudinary');
var multer = require('multer');
const upload = multer({storage, limits: { fieldSize: 15 * 1024 * 1024 }});

module.exports = (app) => {
    app.route('/auth/login')
        .post(userHandlers.login);
    app.route('/profile')
        .get(userHandlers.getProfile)
    app.route('/profile')
        .put(upload.single('profile'),userHandlers.editProfile);
    app.route('/sendotp')
        .post(userSignin);
    app.route('/login/:phone/:otp/:username')
        .get(userLogin);
}