var jwt = require("jsonwebtoken");
var Recipe = require('../models/recipeModel');
var Comment = require('../models/commentModel');
var User = require('../models/userModel');
const { generatePDF } = require("../util/generatePDF");
const { getHtmlContent } = require("../util/recipeUtil");

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
        console.log(req.files);
        if(req.files.recipeVideo) {
            recipe.recipeVideo = req.files.recipeVideo.map(f => ({ url: f.path, filename: f.filename, type: f.mimetype, size: f.size }));
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
    const recipe = await Recipe.find({published: true}).sort({"createdAt": -1});
    res.json(recipe);
}

exports.getRecipeByChef = async (req, res) => {
    const usertoken = req.headers['authorization'];
    const token = usertoken.split(' ');
    const decoded = jwt.verify(token[1], 'RESTFULAPIs');
    const id = decoded._id;
    const publishedRecipe = await Recipe.find({published: true, "author._id": id});
    const savedRecipe = await Recipe.find({published: false, "author._id": id});
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

exports.downloadRecipe = async (req, res) => {
    const recipeById = await Recipe.findById(req.params.recipeId);
    const htmlData = await getHtmlContent(recipeById);
    const pdf = await generatePDF(`<head>
    <style>
        @media print {
            body {
                break-inside: avoid;
            }
        }
        .recipeName {
            color: #FFA300;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: large;
            font-weight: bold;
        }
        .recipeDescription {
            color: #333333;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .cookTime {
            color: #333333;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-weight: bold;
        }
        .ingredients {
            color: #FFA300;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-weight: bold;
            font-size: large;
        }
        .recipe {
            border-collapse: collapse;
            margin: 25px 0;
            font-size: 0.9em;
            font-family: sans-serif;
            min-width: 400px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        }
        .recipe thead tr {
            background-color: #FFA300;
            color: #F4F3F5;
            text-align: center;
        }
        .recipe th,
        .recipe td {
            padding: 12px 15px;
        }
        .recipe tbody tr {
            border-bottom: 1px solid #FFA300;
            text-align: center;
        }
        .recipe tbody tr:nth-of-type(even) {
            background-color: #E9E9E9;
        }
        .recipe tbody tr:last-of-type {
            border-bottom: 2px solid #FFA300;
        }
        .stepCount {
            margin-right: 10px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333333;
            font-weight: bold;
            white-space: nowrap;
        }
        .stepMethod {
            margin-right: 10px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333333;
        }
        .stepDescription {
            color: #333333;
            font-weight: bold;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .stepImage {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }
        .ingredientsName {
            white-space: pre-wrap;
            text-align: center;
            color: #333333;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        </style>
    </head>
    <body>
    ${htmlData}
    </body`);
    res.set("Content-Type", "application/pdf");
    res.send(pdf);
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

exports.searchRecipe = async (req, res) => {
    const title = new RegExp(escapeRegex(req.query.title), 'gi');
    const category = new RegExp(escapeRegex(req.query.category), 'gi');
    const recipe = await Recipe.find({title: title, category: category, published: true});
    res.json(recipe);
}

exports.addComment = async (req, res) => {
    const recipeId = await Recipe.findById(req.params.recipeId);
    const comments = new Comment(req.body);
    const usertoken = req.headers['authorization'];
    const token = usertoken.split(' ');
    const decoded = jwt.verify(token[1], 'RESTFULAPIs');
    const id = decoded._id;
    const user = await User.findById(id);
    const { _id, username, phone } = user;
    const author = {_id: _id, username: username, phone: phone};
    comments.author = author;
    comments.save((err, comment) => {
        recipeId.comments.push({description: req.body.description, author: comment.author});
        recipeId.save();
        res.json({success: true});
    })
}