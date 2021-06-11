const { verifyToken } = require('../authenticate');
var fruitHandlers = require('../controllers/fruitsController');

module.exports = (app) => {
    app.route('/fruit')
        .get( verifyToken , fruitHandlers.getFruit);
}