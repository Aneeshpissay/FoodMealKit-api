const {storage } = require('../cloudinary');
var multer = require('multer');
const upload = multer({storage, limits: { fieldSize: 15 * 1024 * 1024}});
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
    app.route('/recipe/chef')
       .get( recipeHandlers.getRecipe );
    app.route('/recipe/:recipeId')
       .get( recipeHandlers.getRecipeById );
    app.route('/publish/recipe/:recipeId')
        .get( recipeHandlers.publishRecipe );
    app.route('/download/recipe/:recipeId')
        .get( recipeHandlers.downloadRecipe );
    app.route('/search')
        .get( recipeHandlers.searchRecipe );
    app.route('/comment/:recipeId')
        .put(upload.single('commentImage'), recipeHandlers.addComment );
}