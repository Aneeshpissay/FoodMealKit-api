var Fruits = require('../models/fruitsModel');

exports.getFruit = async (req, res) => {
    const fruit = await Fruits.find().sort({"name": 1});
    res.json(fruit);
}