var Fruits = require('../models/fruitsModel');
var Vegetable = require('../models/vegetablesModel');

exports.getAllIngredients = async (req, res) => {
    const fruit = await Fruits.find().sort({"name": 1});
    const vegetable = await Vegetable.find().sort({"name": 1});
    const allIngredients = fruit.concat(vegetable);
    res.json(allIngredients);
}