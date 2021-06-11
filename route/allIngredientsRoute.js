const { verifyToken } = require('../authenticate');
var allIngredientsHandlers = require('../controllers/allIngredients');

module.exports = (app) => {
    app.route('/allIngredients')
        .get( verifyToken , allIngredientsHandlers.getAllIngredients);
}