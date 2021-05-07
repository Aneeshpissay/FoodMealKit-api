var userHandlers = require('../controllers/userController');
const { userSignin, userLogin } = require('../twilio');

module.exports = (app) => {
    app.route('/auth/register')
        .post(userHandlers.register);
    app.route('/auth/login')
        .post(userHandlers.sign_in);
    app.route('/sendotp')
        .post(userSignin);
    app.route('/login/:phone/:otp')
        .get(userLogin)
}