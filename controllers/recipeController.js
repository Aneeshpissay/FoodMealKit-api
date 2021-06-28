var jwt = require("jsonwebtoken");
var Recipe = require('../models/recipeModel');
var { cloudinary } = require('../cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

exports.postRecipe = async (req, res) => {
    try {
        const recipe = new Recipe(req.body);
        recipe.recipeImage = req.files.recipeImage.map(f => ({ url: f.path, filename: f.filename, type: f.mimetype, size: f.size }));
        recipe.ingredients = req.body.ingredients.map((ingredient) => {
            var ingObj = JSON.parse(ingredient);
            return ingObj;
        })
        recipe.preparation = req.body.preparation.map((preparation) => {
            var preparationObj = JSON.parse(preparation);
            preparationObj.stepImage.map(f => cloudinary.uploader.upload(f, {folder: 'Food Meal Kit Blog'}, (err, res) => {
                console.log({url: res.secure_url, filename: res.original_filename, type: res.type, size: res.bytes});
            }))
            console.log(data);
            return preparationObj;
        })
        // recipe.recipeVideo = {url: req.files.recipeVideo[0].path, filename: req.files.recipeVideo[0].filename, type: req.files.recipeVideo[0].mimetype, size: req.files.recipeVideo[0].size};
        // const token = req.token;
        // const decoded = jwt.verify(token, "RESTFULAPIs");
        // recipe.author = {id: decoded._id, username: decoded.username, phone: decoded.phone};
        recipe.save((err) => {
            if (err){
                res.json(err);
            }
            else {
                res.json({success: true})
            }
            
          });
    } catch (error) {
        res.json(error);
    }
}

exports.getRecipe = async (req, res) => {
    const publishedRecipe = await Recipe.find({published: true});
    const savedRecipe = await Recipe.find({published: false});
    res.json({publishedRecipe: publishedRecipe, savedRecipe: savedRecipe});
}

exports.getRecipeById = async (req, res) => {
    const recipeById = await Recipe.findById(req.params.recipeId);
    res.json(recipeById);
}