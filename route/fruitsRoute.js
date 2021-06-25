var fruitHandlers = require('../controllers/fruitsController');

module.exports = (app) => {
    app.route('/fruits')
        .get( fruitHandlers.getFruit);
}