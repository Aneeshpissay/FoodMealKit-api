var jwt = require("jsonwebtoken");
const puppeteer = require('puppeteer');
var Recipe = require('../models/recipeModel');
var User = require('../models/userModel');
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

exports.downloadRecipe = async (req, res) => {
    const recipeById = await Recipe.findById(req.params.recipeId);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const htmlData = await getHtmlContent(recipeById);
    const html = `<head>
    <style>
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
            color: #333333;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-weight: bold;
            font-size: 20px;
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
        .step {
            display: flex;
            flex-direction: row;
        }
        .stepMeasure {
            margin-right: 10px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333333;
            font-weight: bold;
        }
        .stepDescription {
            color: #333333;
            font-weight: bold;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
    </body`;
    await page.setContent(html);
    return page.pdf();
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

exports.searchRecipe = async (req, res) => {
    if(req.query.title) {
        const title = new RegExp(escapeRegex(req.query.title), 'gi');
        const recipe = await Recipe.find({title: title});
        res.json(recipe);
    }
    else if(req.query.category) {
        const category = new RegExp(escapeRegex(req.query.category), 'gi');
        const recipe = await Recipe.find({category: category});
        res.json(recipe);
    }
}