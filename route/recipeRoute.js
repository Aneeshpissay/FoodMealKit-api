const {storage } = require('../cloudinary');
var multer = require('multer');
const upload = multer({storage, limits: { fieldSize: 75 * 1024 * 1024}});
var recipeHandlers = require('../controllers/recipeController');

module.exports = (app) => {
    app.route('/create/recipe')
        .post( upload.fields([
            {
                name: 'recipeImage',
            },
            {
                name: 'recipeVideo',
                maxCount: 1
            },
            {
                name: 'stepImage',
            }
        ]), recipeHandlers.postRecipe);
    app.route('/recipe')
       .get( recipeHandlers.getRecipe );
    app.route('/recipe/:recipeId')
       .get( recipeHandlers.getRecipeById );
}