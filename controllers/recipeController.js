var jwt = require("jsonwebtoken");
var Recipe = require('../models/recipeModel');
var User = require('../models/userModel');

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
            return preparationObj;
        })
        if(req.files.recipeVideo) {
            recipe.recipeVideo = {url: req.files.recipeVideo[0].path, filename: req.files.recipeVideo[0].filename, type: req.files.recipeVideo[0].mimetype, size: req.files.recipeVideo[0].size};
        }
        const usertoken = req.headers['authorization'];
        const token = usertoken.split(' ');
        const decoded = jwt.verify(token[1], 'RESTFULAPIs');
        const id = decoded._id;
        const user = await User.findById(id);
        const { _id, username, phone } = user;
        const author = {_id: _id, username: username, phone: phone};
        recipe.author = author;
        // const token = req.token;
        // const decoded = jwt.verify(token, "RESTFULAPIs");
        // recipe.author = {id: decoded._id, username: decoded.username, phone: decoded.phone};
        recipe.save((err) => {
            if (err){
                console.log(err);
            }
            else {
                res.json({success: true});
            }
            
          });
    } catch (error) {
        console.log(error);
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

exports.publishRecipe = async (req, res) => {
    const recipeById = await Recipe.findById(req.params.recipeId);
    recipeById.published = true;
    recipeById.save((err) => {
        if(err) {
            console.log(err);
        }
        else {
            res.json({success: true});
        }
    })
}