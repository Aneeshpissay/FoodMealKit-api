var Vegetable = require('../models/vegetablesModel');

exports.getVegetable = async (req, res) => {
    const vegetable = await Vegetable.find().sort({"name": 1});
    res.json(vegetable);
}