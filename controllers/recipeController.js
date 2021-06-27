var jwt = require("jsonwebtoken");
var Recipe = require('../models/recipeModel');

exports.postRecipe = async (req, res) => {
    try {
        const recipe = new Recipe(req.body);
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