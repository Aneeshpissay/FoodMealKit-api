const { verifyToken } = require('../authenticate');
const {storage } = require('../cloudinary');
var multer = require('multer');
const upload = multer({storage});
var recipeHandlers = require('../controllers/recipeController');

module.exports = (app) => {
    app.route('/create/recipe')
        .post( verifyToken , upload.fields([
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
}