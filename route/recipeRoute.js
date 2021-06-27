const {storage } = require('../cloudinary');
var multer = require('multer');
const upload = multer({storage});
var recipeHandlers = require('../controllers/recipeController');

module.exports = (app) => {
    app.route('/create/recipe')
        .post( upload.fields([
            {
                name: 'recipeVideo',
                maxCount: 1
            }
        ]), recipeHandlers.postRecipe);
    app.route('/recipe')
       .get( recipeHandlers.getRecipe );
    app.route('/recipe/:recipeId')
       .get( recipeHandlers.getRecipeById );
}