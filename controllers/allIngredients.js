var AllIngredients = require('../models/allIngredients');

exports.getAllIngredients = async (req, res) => {
    const allIngredients = await AllIngredients.find().sort({"name": 1});
    res.json(allIngredients);
}