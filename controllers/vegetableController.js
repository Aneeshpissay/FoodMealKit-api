var Vegetable = require('../models/vegetablesModel');

exports.getVegetable = async (req, res) => {
    const vegetable = await Vegetable.find();
    res.json(vegetable);
}