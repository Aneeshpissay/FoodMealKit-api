var allIngredientsHandlers = require('../controllers/allIngredients');

module.exports = (app) => {
    app.route('/allIngredients')
        .get( allIngredientsHandlers.getAllIngredients);
}