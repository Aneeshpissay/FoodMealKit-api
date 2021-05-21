var jwt = require("jsonwebtoken");
var Recipe = require('../models/recipeModel');

exports.postRecipe = async (req, res) => {
    const recipe = new Recipe(req.body);
    recipe.recipeImage = req.files.recipeImage.map(f => ({ url: f.path, filename: f.filename, type: f.mimetype, size: f.size }));
    recipe.recipeVideo = {url: req.files.recipeVideo[0].path, filename: req.files.recipeVideo[0].filename, type: req.files.recipeVideo[0].mimetype, size: req.files.recipeVideo[0].size};
    const token = req.token;
    const decoded = jwt.verify(token, "RESTFULAPIs");
    recipe.author = {id: decoded._id, username: decoded.username, phone: decoded.phone};
    recipe.save();
    res.json({success: true});
}

exports.getRecipe = async (req, res) => {
    const privateRecipe = await Recipe.findOne({private: true});
    const publicRecipe = await Recipe.findOne({private: false});
    res.json({privateRecipe: privateRecipe, publicRecipe: publicRecipe});
}

exports.getRecipeById = async (req, res) => {
    const recipeById = await Recipe.findById(req.params.recipeId);
    res.json(recipeById);
}