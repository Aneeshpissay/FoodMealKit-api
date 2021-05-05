var userHandlers = require('../controllers/userController');

module.exports = (app) => {
    app.route('/auth/register')
        .post(userHandlers.register);
    app.route('/auth/login')
        .post(userHandlers.sign_in);
}